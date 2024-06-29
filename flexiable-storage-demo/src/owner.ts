// owner.ts
import { v4 as uuidv4 } from 'uuid';

class Owner {
  id: string;
  address: string;
  name: string;

  constructor(address: string, name: string) {
    this.id = uuidv4();
    this.address = address;
    this.name = name;
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      address: this.address,
      name: this.name,
    });
  }

  static fromJSON(json: string): Owner {
    const data = JSON.parse(json);
    const owner = new Owner(data.address, data.name);
    owner.id = data.id;
    return owner;
  }
}

export default Owner;