export interface IloginStore {
    logined: boolean,
    loading: boolean,

    id: string | null,
    name: string | null,
    image: string | null,
}

const defaultStore: IloginStore = {
    logined: false,
    loading: true,
    
    id: null,
    name: null,
    image: null
}
type reduxAction = {
    type: string,
    [key: string]: any
}

export default function(store = defaultStore, action: reduxAction) {
    const newStore = {...store};
    switch (action.type) {
        case "login.set":
            if (action.logined !== undefined) {
                newStore.logined = action.logined;
                
                if (action.logined === true) {
                    newStore.id = action.id;
                    newStore.name = action.name;
                    newStore.image = action.image;
                }
            }
            if (action.loading !== undefined)
                newStore.loading = action.loading;
            return newStore;
    }

    return store;
}