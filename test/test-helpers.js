const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
        id: 1,
        first_name: 'Zoe',
        email: 'zoe@gmail.com',
        password: 'ZoePass33!',
        location: 'POINT(-73.8746 40.7502)',
        radius: '1609.34'
    },
    {
        id: 2,
        first_name: 'Robin',
        email: 'robin@gmail.com',
        password: 'RobinPass1!',
        location: 'POINT(-73.897 40.7482)',
        radius: '3218.69'
    },
    {
        id: 3,
        first_name: 'James',
        email: 'james@gmail.com',
        password: 'JamesPass1!',
        location: 'POINT(-73.8903 40.7512)',
        radius: '4023.36'
    }
  ]
}

function makePostsArray(users) {
  return [
    {
        id: 1,
        user_id: users[0].id,
        post_type: 'request',
        description: 'Need help',
        urgency: 'high',
        date_created: '2029-01-22T16:28:32.615Z'
    },
    {
        id: 2,
        user_id: users[1].id,
        post_type: 'offer',
        description: 'Available to help',
        urgency: null,
        date_created: '2029-01-22T16:28:32.615Z'
    },
    {
        id: 3,
        user_id: users[2].id,
        post_type: 'offer',
        description: null,
        urgency: null,
        date_created: '2029-01-22T16:28:32.615Z'
    },
    {
        id: 4,
        user_id: users[2].id,
        post_type: 'request',
        description: 'Description',
        urgency: 'high',
        date_created: '2029-01-22T16:28:32.615Z'
    },
  ]
}

function makeCategoryArray() {
    return [
        {
            id: 1,
            category: 'Picking up supplies'
        },
        {
            id: 2,
            category: 'Running errands'
        },
        {
            id: 3,
            category: 'Phone call'
        },
        {
            id: 4,
            category: 'Online chat'
        },
        {
            id: 5,
            category: 'Dog walking'
        },
        {
            id: 6,
            category: 'Other'
        }
    ]
}

function makePostCategoryAssocArray(posts, categories) {
  return [
    {
        id: 1,
        post_id: posts[0].id,
        category_id: categories[3].id
    },
    {
        id: 2,
        post_id: posts[0].id,
        category_id: categories[4].id
    },
    {
        id: 3,
        post_id: posts[1].id,
        category_id: categories[1].id
    },
    {
        id: 4,
        post_id: posts[2].id,
        category_id: categories[3].id
    },
    {
        id: 5,
        post_id: posts[2].id,
        category_id: categories[5].id
    },
    {
        id: 6,
        post_id: posts[3].id,
        category_id: categories[2].id
    }
  ];
}

function makeChatsArray(users, posts) {
  return [
    {
      id: 1,
      user1_id: users[0].id,
      user2_id: users[1].id,
      post_id: posts[0].id
    },
    {
      id: 2,
      user1_id: users[1].id,
      user2_id: users[2].id,
      post_id: posts[1].id
    },
    {
      id: 3,
      user1_id: users[0].id,
      user2_id: users[2].id,
      post_id: posts[3].id
    }
  ]
}

function makeMessagesArray(chats) {
  return [
    {
      id: 1,
      chat_id: chats[0].id,
      sender_id: chats[0].user1_id,
      message_timestamp: '2029-01-22T16:28:32.615',
      message_content: 'Hey there!'
    },
    {
      id: 2,
      chat_id: chats[1].id,
      sender_id: chats[1].user2_id,
      message_timestamp: '2029-01-22T16:25:32.615',
      message_content: 'Hey!'
    },
    {
      id: 3,
      chat_id: chats[2].id,
      sender_id: chats[2].user1_id,
      message_timestamp: '2029-01-22T16:24:32.615',
      message_content: 'Sup!'
    },
    {
      id: 4,
      chat_id: chats[0].id,
      sender_id: chats[0].user2_id,
      message_timestamp: '2029-01-22T16:23:32.615',
      message_content: 'Heyyyyy!'
    },
    {
      id: 5,
      chat_id: chats[1].id,
      sender_id: chats[1].user1_id,
      message_timestamp: '2029-01-22T16:22:32.615',
      message_content: 'Oh hi!!'
    },
    {
      id: 6,
      chat_id: chats[2].id,
      sender_id: chats[2].user2_id,
      message_timestamp: '2029-01-22T16:21:32.615',
      message_content: 'Whats up man?'
    }
  ]
}

function getPostCategories(post, categories, categoryPostAssoc) {
    const postCategories = categoryPostAssoc.filter(cat => cat.post_id === post.id)
    const categoryIds = postCategories.map(assoc => assoc.category_id)
    const categoryNames = []
    categoryIds.forEach(catId => {
        const cat = categories.find(cat => cat.id === catId);
        categoryNames.push(cat.category)
    })
    return categoryNames;
}

function makeExpectedPosts(posts, users, categories, categoryPostAssoc) {
    const expectedPosts = posts.map(post => {
        const user = users.find(user => user.id === post.user_id)
        const fixedLocation = {
          lat: parseFloat(user.location.slice(6, -1).split(' ')[1]),
          lng: parseFloat(user.location.slice(6, -1).split(' ')[0])
        }
        const expected = {...post, location: fixedLocation, radius: parseFloat(user.radius/1609.34).toFixed(2), first_name: user.first_name, categories: getPostCategories(post, categories, categoryPostAssoc)}
        return expected;
    })
    return expectedPosts;
}

function makeExpectedUserInformation(user) {
  const fixedLocation = {
    lat: parseFloat(user.location.slice(6, -1).split(' ')[1]),
    lng: parseFloat(user.location.slice(6, -1).split(' ')[0])
  }
  
  return {
    id: user.id,
    first_name: user.first_name,
    email: user.email,
    location: fixedLocation,
    radius: parseFloat(user.radius/1609.34).toFixed(2)
  }
}

function makeExpectedChats(chats, users, posts, messages) {
  return chats.map(chat => {
    const user1 = users.find(user => user.id === chat.user1_id)
    const user2 = users.find(user => user.id === chat.user2_id)
    const post = posts.find(post => post.id === chat.post_id)
    const messageArray = messages.filter(message => message.chat_id === chat.id);
    const orderedMessages = messageArray.sort((a, b) => {
      if (a.message_timestamp < b.message_timestamp) {
        return -1
      } else if (b.message_timestamp < a.message_timestamp) {
        return 1
      }
    })
    expected = {...chat, user1: { first_name: user1.first_name, id: user1.id }, user2: { first_name: user2.first_name, id: user2.id }, post: {...post, date_created: post.date_created.slice(0, -1)}, messages: orderedMessages }

    delete expected.user1_id;
    delete expected.user2_id;
    delete expected.post_id;

    return expected;
  })
}

function makeFixtures() {
  const testUsers = makeUsersArray()
  const testPosts = makePostsArray(testUsers)
  const testCategories = makeCategoryArray()
  const testPostCategoryAssoc = makePostCategoryAssocArray(testPosts, testCategories)
  const testChats = makeChatsArray(testUsers, testPosts)
  const testMessages = makeMessagesArray(testChats)
  
  return { testUsers, testPosts, testCategories, testPostCategoryAssoc, testChats, testMessages }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        community_users,
        community_posts,
        community_categories,
        community_categories_post_assoc,
        community_chats,
        community_messages
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE community_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE community_posts_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE community_categories_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE community_categories_post_assoc_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE community_chats_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE community_messages_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('community_users_id_seq', 0)`),
        trx.raw(`SELECT setval('community_posts_id_seq', 0)`),
        trx.raw(`SELECT setval('community_categories_id_seq', 0)`),
        trx.raw(`SELECT setval('community_categories_post_assoc_id_seq', 0)`),
        trx.raw(`SELECT setval('community_chats_id_seq', 0)`),
        trx.raw(`SELECT setval('community_messages_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('community_users').insert(preppedUsers)
    .then(() => 
      db.raw(
        `SELECT setval('community_users_id_seq', ?)`, 
        [users[users.length - 1].id],
      )
    )
}

function seedTables(db, users, posts, categories, catPostAssoc, chats, messages) {
  
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    
    await trx.into('community_users').insert(users)
    await trx.into('community_posts').insert(posts)
    await trx.into('community_categories').insert(categories)
    await trx.into('community_categories_post_assoc').insert(catPostAssoc)
    await trx.into('community_chats').insert(chats)
    await trx.into('community_messages').insert(messages)

    await Promise.all([
      trx.raw(
        `SELECT setval('community_users_id_seq', ?)`,
        [users[users.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('community_posts_id_seq', ?)`,
        [posts[posts.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('community_categories_id_seq', ?)`,
        [categories[categories.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('community_categories_post_assoc_id_seq', ?)`,
        [catPostAssoc[catPostAssoc.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('community_chats_id_seq', ?)`,
        [chats[chats.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('community_messages_id_seq', ?)`,
        [messages[messages.length - 1].id],
      ),
    ])
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makePostsArray,
  makeCategoryArray,
  makePostCategoryAssocArray,
  makeChatsArray,
  makeMessagesArray,
  makeExpectedPosts,
  makeExpectedUserInformation,
  makeExpectedChats,
  makeFixtures,
  cleanTables,
  seedUsers,
  seedTables,
  makeAuthHeader,
}
