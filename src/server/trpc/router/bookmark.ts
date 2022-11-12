import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

const createBookmarkSchema = z.object({
  title: z.string(),
  url: z.string().url(),
});

const bookmarkSchema = createBookmarkSchema.extend({
  userId: z.string().cuid(),
})

export const bookmarkRouter = router({
  create: publicProcedure
    .input(createBookmarkSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new Error();
      }

      const bookmark = await ctx.prisma.bookmark.create({
        data: {
          ...input,
          userId: ctx.session.user.id
        },
      });

      return bookmark;
    }),
  list: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session?.user) {
        return [];
      }

      const bookmarks = await ctx.prisma.bookmark.findMany({
        where: {
          userId: ctx.session.user.id,
        }
      })

      return bookmarks;
    }),
});
