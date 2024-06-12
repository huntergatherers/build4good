import { PrismaClient, Prisma, listing_type_enum, tag_type_enum , scrap_type_enum, compost_type_enum } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
export default prisma;
export { Prisma , listing_type_enum, tag_type_enum , scrap_type_enum, compost_type_enum};


