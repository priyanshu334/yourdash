'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const games = [
  { name: 'Game 1', path: '/games/game1' },
  { name: 'Game 2', path: '/games/game2' },
  { name: 'Game 3', path: '/games/game3' },
  {name:"Admin Signup", path:"/adminlogin"}
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 fixed">
      <h2 className="text-xl font-semibold mb-4">Games</h2>
      <nav>
        <ul>
          {games.map((game) => (
            <li key={game.path}>
              <Link
                href={game.path}
                className={cn(
                  'block p-2 rounded-md hover:bg-gray-700 transition',
                  pathname === game.path && 'bg-gray-700'
                )}
              >
                {game.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
