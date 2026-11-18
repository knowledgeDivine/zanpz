/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/composer",
      "@prisma/composer-prisma-cloud",
      "@prisma/orm-postgres",
    ],
  },
};
