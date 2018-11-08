# Store API
Пример использования (`./src/components/MyFlux.vue`) http://localhost:8080/#/flux

## Опции конструктора Store
 - state (`object`) - корневой объект состояния
 - mutations(`{[type: string]: function}`) - доступные мутации, для изменения состояния достаточно изменить переданный `state`
 - persisted(`[string| Object]`) - можно указать, какие значения должны быть сохранены в localStorage. Можно вручную определить геттер и сеттер:
```js
{
  property: 'myProp',
  set: (key, value) => {
    Cookie.set(key, value)
  },
  get: (key) => {
    return Cookie.get(key)
  }
}
```
 ## Методы
 - run (`type: String, args?: any`, ) - вызвать мутацию
 ```
 store.run('someMutation', args)
 ```
 - subscribe (`subscribe (handler: Function): Function(сurrentState, prevState)`) - подписка на изменения, `handler` будет вызван при любом вызове мутации и получит текущие и предыдущее состояние.
 ```js
const handler = (currentState, prevState) => {
  console.log(currentState, prevState)
}
store.subscribe(handler)
 ```
 - unsubscribe (`unsubscribe (handler: Function): Function`) - отписаться от изменений
 ```js
 store.unsubscribe(handler)
 ```
 - getState(`Function`) - получить текущее состояние
 ```js
 const currentState = Store.getState()
 ```

 ## Пример:

 ```js
 const Store = require('store')

 const MyReducer = {
   state: {
     count: 0
   },
   mutations: {
     increment(state) {
       state.count +=1
     },
     decrement(state) {
       state.count -=1
     }
   }
 }

const store = new Store(MyReducer)

const handler = (state, oldState) => {
  console.log(state.count, oldState.count)
}

store.subscribe(handler)

store.run('increment') // 1 0
store.run('increment') // 2 1
store.run('decrement') // 1 2

```