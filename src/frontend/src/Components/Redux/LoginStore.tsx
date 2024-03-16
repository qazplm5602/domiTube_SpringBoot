export interface IloginStore {
    logined: boolean,

    id: string | null,
    name: string | null,
    image: string | null,
}

const defaultStore: IloginStore = {
    logined: false,
    
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
        case "hello":
            return newStore;
    }

    return store;
}