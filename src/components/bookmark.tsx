import { AppRouterTypes, ArrElement } from "../utils/trpc";
import { StarIcon } from "./icon";
import IconButton from "./icon-button";

type Bookmark = ArrElement<AppRouterTypes["bookmark"]["list"]["output"]>;

interface BookmarkProps {
  bookmark: Bookmark;
  rowNum?: number;
  onFavorite: React.MouseEventHandler<SVGElement>;
}

const Bookmark: React.FC<BookmarkProps> = ({
  bookmark,
  rowNum,
  onFavorite,
}) => {
  const bg = rowNum && rowNum % 2 ? "bg-violet-50" : "";

  return (
    <div
      className={`flex flex-row justify-between border-2 border-slate-500 p-4 align-middle ${bg} min-w-64 mt-1 w-1/3`}
    >
      <div className="flex flex-col">
        <span className="text-lg">{bookmark.title}</span>
        <span className="text-sm">
          <em>{bookmark.url}</em>
        </span>
      </div>
      <div className="flex flex-col justify-center">
        <IconButton
          handleClick={onFavorite}
          Icon={StarIcon}
          iconProps={{ fillColor: "gold", filled: bookmark.favorite }}
        />
      </div>
    </div>
  );
};

export default Bookmark;
