let db = {
    users: [
        {
            userId: "dh821hd912hd",
            email: "user@email.com",
            handle: "user",
            createdAt: "2019-03-15T10:59:52.798z",
            imageUrl: "image/dsdjasdhsadlsajkh",
            bio: "Hello, my name is user, nice to meet you",
            website: "https://user.com",
            location: "London, UK",
        },
    ],
    screams: [
        {
            userHandle: "user",
            body: "this is the scream body",
            createdAt: "2021-04-23T13:33:56.887Z",
            likeCount: 5,
            commentCount: 2,
        },
    ],
    comments: [
        {
            userHandle: "user",
            screamId: "dsajdlksajdlksajdlaskjds",
            body: "Nice one mate!",
            createdAt: "2021-04-23T13:33:56.887Z",
        },
    ],
    notifications: [
        {
            recipient: "user",
            sender: "john",
            read: "true|false",
            screamId: "dsajdlksajdlksajdlaskjds",
            type: "like|comment",
            createdAt: "2021-04-23T13:33:56.887Z",
        },
    ],
};

const userDetails = {
    // Redux data
    credentials: {
        userId: "NDASDJASDHAS12312H",
        email: "user@email.com",
        handle: "user",
        createdAt: "2019-03-15T10:59:52.798z",
        imageUrl: "image/djsdlkajdlksjad/djsalkdjsalk",
        bio: "Hello, my name is user",
        website: "https://user.com",
        location: "London, UK",
    },
    likes: [
        {
            userHandle: "user",
            screamId: "hh2131273h8hoih8",
        },
        {
            userHandle: "user",
            screamId: "8u12dasd102jd",
        },
    ],
};
