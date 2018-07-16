import { resolve } from "any-promise";

export const mockTruffleContract = {
    currentProvider: jest.fn(),
    setProvider: jest.fn(),
    deployed: jest.fn(() => {
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    })
}

