/**
 * Since array variables on contracts need to be accessed by index one-by-one with web3,
 * updating state every time a new variable is retrieved would lead to concurrent state changes and errors.
 * This simple util will serve as a temporary cache to hold array variables till they can be updated in state.
 */

let cache = {}

class ArrayCache {

    /**
     * @param name - Name of array
     * @param obj - Variable to be stored
     */
    add = (name, obj) => {
        if (!cache[name])
            cache[name] = []
        cache[name].push(obj)
    }

    get = (name) => {
        if (!cache[name])
            cache[name] = []
        return cache[name]
    }

    clear = (name) => {
        cache[name] = []
    }

}

export default ArrayCache