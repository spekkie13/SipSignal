global.chrome = {
    storage: {
        local: {
            get: jest.fn((keys, cb) => cb({ hydration: 1000 })),
            set: jest.fn((data, cb) => cb && cb())
        }
    },
    notifications: {
        create: jest.fn()
    }
};
