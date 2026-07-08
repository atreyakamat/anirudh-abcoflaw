param(
  [ValidateSet('generate', 'migrate', 'studio')]
  [string]$Command = 'generate'
)

switch ($Command) {
  'generate' { npm run db:generate }
  'migrate' { npm run db:migrate }
  'studio' { npm run prisma:studio -w backend }
}
