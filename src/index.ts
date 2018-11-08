import { cloneDeep, isEqual } from 'lodash'

interface InterfaceState {
  [key: string]: any
}

type Listener = ((newState: any, prevState: any) => any)

interface InterfaceMutations<T> {
  [method: string]: (state: T, args?: any) => void
}

interface InterfacePersisted {
  property: string,
  set: (key: string, value: any) => any,
  get: (key: string) => any,
  listener?: (value: any, prevValue: any) => {},
}

interface InterfaceStore<T> {
  state: T
  mutations: InterfaceMutations<T>
  persisted?: (string|InterfacePersisted)[]
}

export class Store<T extends InterfaceState> {
  public state: T
  private mutations: InterfaceMutations<T>
  private listeners: Listener[]
  private persisted?: InterfacePersisted[]

  constructor({ state, mutations, persisted }: InterfaceStore<T>) {
    this.mutations = mutations
    this.state = state
    this.listeners = []
    if (persisted && localStorage) {
      this.persisted = persisted.map(i => {
        if (typeof i === 'string') {
          const property = i
          return {
            property,
            set: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
            get: (key: string) => JSON.parse(String(localStorage.getItem(key)))
          }
        } else {
          return i
        }
      })
      this.persisted.forEach(i => {
        const finded = i.get(i.property)
        if(finded) {
          this.state[i.property] = i.get(i.property)
        }
      })
    }
  }

  public run(action: string, args?: any): any {
    const prevState = this.state
    const newState = cloneDeep(this.state) as T
    const result = this.mutations[action](newState, args)
    this.state = newState
    if (this.persisted && localStorage) {
      this.persisted.forEach(i => {
        if (!isEqual(prevState[i.property], newState[i.property])) {
          i.set(i.property, newState[i.property])
        }
      })
    }
    this.listeners.forEach(cb => {
      cb(newState, prevState)
    })
    return result
  }

  public getState(): InterfaceState {
    return cloneDeep(this.state)
  }

  public subscribe(newListener: Listener): void {
    this.listeners.push(newListener)
  }

  public unsubscribe(cb: () => any): void {
    this.listeners.splice(this.listeners.indexOf(cb), 1)
  }
}

export default Store
