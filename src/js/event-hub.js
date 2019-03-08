window.eventHub = {
    events: {

    },
    emit(eventName, data1,data2) {
        for (let key in this.events) {
            if (eventName === key) {
                let fnList = this.events[eventName]
                fnList.map((fn) => {
                    fn(data1,data2)
                })
            }
        }
    },
    on(eventName, fn) {
        if (this.events[eventName] === undefined) {
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
}