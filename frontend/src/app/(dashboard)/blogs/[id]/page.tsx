'use client';

import { useState, useEffect, use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']),
  categoryId: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const { data: blog, isLoading: isBlogLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${id}`);
      return res.data.data;
    }
  });

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: 'DRAFT',
      content: '',
    }
  });

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || '',
        content: blog.content,
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        status: blog.status,
        categoryId: blog.categoryId || '',
      });
    }
  }, [blog, reset]);

  const contentWatch = watch('content');
  const titleWatch = watch('title');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('title', e.target.value);
    const currentSlug = watch('slug');
    if (!currentSlug || currentSlug === e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, -1)) {
       setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      try {
        const res = await api.get('/blogs/categories');
        return res.data.data;
      } catch (e) {
        return [{ id: '1', name: 'Legal News' }, { id: '2', name: 'Firm Updates' }];
      }
    }
  });

  const updatePost = useMutation({
    mutationFn: async (data: BlogFormValues) => {
      return api.put(`/blogs/${id}`, data);
    },
    onSuccess: () => {
      toast.success('Blog post updated successfully!');
      router.push('/blogs');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update blog post');
    }
  });

  const onSubmit = (data: BlogFormValues) => {
    updatePost.mutate(data);
  };

  if (isBlogLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 rounded-3xl sticky top-4 z-40">
        <div className="flex items-center gap-4">
          <Link href="/blogs" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold font-serif text-slate-900">Edit Post</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSubmit((d) => onSubmit({...d, status: 'DRAFT'}))}
            disabled={updatePost.isPending}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button 
            onClick={handleSubmit((d) => onSubmit({...d, status: 'PUBLISHED'}))}
            disabled={updatePost.isPending}
            className="px-6 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-xl hover:-translate-y-0.5 rounded-xl transition-all flex items-center gap-2"
          >
            {updatePost.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Publish Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Editor Section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 md:p-8 space-y-6">
            
            <div>
              <input 
                {...register('title')}
                onChange={handleTitleChange}
                placeholder="Post Title..."
                className="w-full text-4xl font-bold font-serif bg-transparent border-none outline-none placeholder:text-slate-300 text-slate-900 focus:ring-0 px-0"
              />
              {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>}
            </div>

            <div>
              <input 
                {...register('excerpt')}
                placeholder="Write a brief excerpt..."
                className="w-full text-lg text-slate-500 bg-transparent border-none outline-none placeholder:text-slate-300 focus:ring-0 px-0"
              />
            </div>
            
            <hr className="border-slate-100" />

            {/* Editor / Preview Toggle */}
            <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('write')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'write' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Write (Markdown)
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'preview' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Preview
              </button>
            </div>

            {/* Markdown Textarea */}
            <div className={activeTab === 'write' ? 'block' : 'hidden'}>
              <textarea 
                {...register('content')}
                placeholder="Start writing your post content here using Markdown..."
                className="w-full min-h-[500px] text-slate-700 bg-transparent border-none outline-none placeholder:text-slate-300 focus:ring-0 px-0 resize-y font-mono text-sm leading-relaxed"
              />
              {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content.message}</p>}
            </div>

            {/* Markdown Preview */}
            <div className={`${activeTab === 'preview' ? 'block' : 'hidden'} min-h-[500px] prose prose-slate max-w-none`}>
              {contentWatch ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {contentWatch}
                </ReactMarkdown>
              ) : (
                <p className="text-slate-400 italic">Nothing to preview yet.</p>
              )}
            </div>

          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 space-y-6">
            <h3 className="font-serif font-bold text-lg text-slate-900">Post Settings</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">URL Slug</label>
              <input 
                {...register('slug')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select 
                {...register('categoryId')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select Category</option>
                {categories?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Featured Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
                <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 space-y-6">
            <h3 className="font-serif font-bold text-lg text-slate-900">SEO Settings</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Meta Title</label>
              <input 
                {...register('seoTitle')}
                placeholder={titleWatch || "SEO Title"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Meta Description</label>
              <textarea 
                {...register('seoDescription')}
                rows={3}
                placeholder="Brief description for search engines..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
