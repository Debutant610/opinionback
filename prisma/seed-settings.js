const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.settings.upsert({
    where: { id: "global" },
    update: {
      brokerApiKey: "QR1vZI5oIciUzPeX",
      brokerPassword: "Degage&8",
      brokerUrl: "https://api.opinback.com/broker" // Placeholder URL
    },
    create: {
      id: "global",
      brokerApiKey: "QR1vZI5oIciUzPeX",
      brokerPassword: "Degage&8",
      brokerUrl: "https://api.opinback.com/broker"
    }
  })
  console.log("Paramètres broker initialisés avec succès.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
