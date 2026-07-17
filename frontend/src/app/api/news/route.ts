import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET() {
  try {
    const parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'mediaContent', { keepArray: true }],
          ['content:encoded', 'contentEncoded'],
        ]
      }
    });
    
    // We can fetch from multiple legal feeds to ensure we get 20 articles in English.
    const feeds = [
      'https://www.livelaw.in/rss',
      'https://news.google.com/rss/search?q=india+supreme+court+legal+news&hl=en-IN&gl=IN&ceid=IN:en'
    ];
    
    let allItems: any[] = [];
    
    for (const feed of feeds) {
      try {
        const parsed = await parser.parseURL(feed);
        if (parsed.items) {
          allItems = [...allItems, ...parsed.items];
        }
      } catch (err) {
        console.error(`Failed to parse feed: ${feed}`, err);
      }
    }
    
    // Sort by pubDate descending
    allItems.sort((a, b) => {
      return new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime();
    });
    
    // Process items to extract images if they exist
    const processedItems = allItems.slice(0, 20).map(item => {
      let imageUrl = null;
      
      // Try to get image from media:content
      if (item.mediaContent && item.mediaContent.length > 0 && item.mediaContent[0].$) {
        imageUrl = item.mediaContent[0].$.url;
      } 
      // Try to extract image from description or content:encoded
      else if (item.contentEncoded || item.content) {
        const contentStr = item.contentEncoded || item.content;
        const imgMatch = contentStr.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1];
        }
      }
      
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        imageUrl: imageUrl,
        source: item.creator || item.source || 'Legal News'
      };
    });
    
    return NextResponse.json({ items: processedItems });
  } catch (error: any) {
    console.error('RSS Fetch error:', error);
    return NextResponse.json({ error: error.message, items: [] }, { status: 500 });
  }
}
