declare module 'eventing-bus' {
    import * as EventingBus from 'eventing-bus'

    export type EventingBus = {
        on: EventingBusListener
        publish: EventingBusEmmiter
    }

    export type EventingBusListener = {
        (label: string, event: any): any
    }

    export type EventingBusEmmiter = {
        (label: string): any
    }
}
