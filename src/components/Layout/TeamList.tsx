import { classNames } from "./className";
import { Team } from "./types";

interface TeamsListProps {
  teams: Team[];
}

export const TeamsList: React.FC<TeamsListProps> = ({ teams }) => (
  <div>
    <div className="text-xs/6 font-semibold text-gray-400">Your teams</div>
    <ul role="list" className="-mx-2 mt-2 space-y-1">
      {teams.map((team) => (
        <li key={team.name}>
          <div
            // href={team.href}
            className={classNames(
              team.current
                ? "bg-gray-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
            )}
          >
            <span
              className={classNames(
                team.current
                  ? "border-indigo-600 text-indigo-600"
                  : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                "flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
              )}
            >
              {team.initial}
            </span>
            <span className="truncate">{team.name}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
