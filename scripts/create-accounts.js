const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('AdminOpin2025!', 10)
  const clientPasswordHash = await bcrypt.hash('TraderOpin2025!', 10)

  console.log('--- CRÉATION DES COMPTES OPINBACK ---')

  // 1. Création de l'ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@opinback.fr' },
    update: {},
    create: {
      email: 'admin@opinback.fr',
      passwordHash: passwordHash,
      role: 'ADMIN',
      status: 'FUNDED',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'Opinback',
          country: 'France'
        }
      }
    }
  })
  console.log('✅ Compte ADMIN créé : admin@opinback.fr')

  // 2. Création du CLIENT (Trader)
  const client = await prisma.user.upsert({
    where: { email: 'contact@opinback.fr' },
    update: {},
    create: {
      email: 'contact@opinback.fr',
      passwordHash: clientPasswordHash,
      role: 'TRADER',
      status: 'PENDING',
      profile: {
        create: {
          firstName: 'Client',
          lastName: 'Test',
          country: 'France'
        }
      }
    }
  })
  console.log('✅ Compte CLIENT créé : contact@opinback.fr')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la création :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
