import { createShuffledNumbersArray } from './utils';
import { ROLES } from './boardElements';

export default interface GameMetadata {
  id?:string;
  startTime:string;
  difficulty:number;
  players:PlayerMetadata[];
}

export interface PlayerMetadata {
  name:string;
  role:number;
  client?:string;
}

export interface PlayerOptions {
  name:string|null;
  role:number|null;
}

export function initGame(difficulty:number, playerOptions:PlayerOptions[], client?:string):GameMetadata {
  let availableRoles = createShuffledNumbersArray(ROLES.length);
  // remove roles that selected
  availableRoles = availableRoles.filter(role => !playerOptions.some(p => p.role === role));
  const players:PlayerMetadata[] = playerOptions.map((options, i) => {
    let name:string = options.name || "Player " + (i + 1);
    let role:number;
    if (options.role === null) {
        role = <number>availableRoles.pop();
    } else {
        role = options.role;
    }
    return {
      name, role, client
    };
  });

  return {
    startTime: new Date().toISOString(),
    difficulty,
    players
  };
}