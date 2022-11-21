import { router, publicProcedure } from "../trpc";
import { z } from "zod";

const createBookmarkSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  favorite: z.boolean().default(false),
});

const bookmarkSchema = createBookmarkSchema.extend({
  id: z.string().cuid(),
  userId: z.string().cuid(),
});

const updateBookmarkSchema = bookmarkSchema.omit({
  id: true,
  userId: true,
});

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
          userId: ctx.session.user.id,
        },
      });

      return bookmark;
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      return [];
    }

    const bookmarks = await ctx.prisma.bookmark.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return bookmarks;
  }),
  update: publicProcedure
    .input(bookmarkSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new Error();
      }

      if (ctx.session.user.id !== input.userId) {
        throw new Error();
      }

      const bookmark = await ctx.prisma.bookmark.update({
        where: {
          id: input.id,
        },
        data: updateBookmarkSchema.parse(input),
      });

      return bookmark;
    }),
});
