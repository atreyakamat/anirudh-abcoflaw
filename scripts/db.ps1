param(
  [ValidateSet('generate', 'migrate', 'seed', 'studio', 'prepare')]
  [string]$Command = 'generate'
)

switch ($Command) {
  'generate' { npm run db:generate }
  'migrate' { npm run db:migrate }
  'seed' { npm run db:seed }
  'prepare' { npm run db:prepare }
  'studio' { npm run prisma:studio -w backend }
}
