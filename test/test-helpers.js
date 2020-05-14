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
        location: 'POINT(-73.8970 40.7482)',
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
        date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
        id: 2,
        user_id: users[1].id,
        post_type: 'offer',
        description: 'Available to help',
        urgency: null,
        date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
        id: 3,
        user_id: users[2].id,
        post_type: 'offer',
        description: null,
        urgency: null,
        date_created: new Date('2029-01-22T16:28:32.615Z')
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
        post_id: 1,
        category_id: 3
    },
    {
        id: 2,
        post_id: 1,
        category_id: 5
    },
    {
        id: 3,
        post_id: 2,
        category_id: 2
    },
    {
        id: 4,
        post_id: 3,
        category_id: 4
    },
    {
        id: 5,
        post_id: 3,
        category_id: 6
    },
  ];
}

function makeExpectedPosts(list, user) {
    // const filteredList = list.filter(item => 
    //   item.user_id === user.id && item.status !== 'completed'
    // ) 
    
    // const expectedList = filteredList.map(item => { 
    //   const pm = pms.find(pm => pm.id === item.pm_id)
    //   const expected = {...item, pm_name: pm.pm_name, pm_email: pm.pm_email, date_created: item.date_created.toISOString() }
    //   delete expected['pm_id']
    //   delete expected['user_id']
    //   return expected;
    // }) 
    
    // return expectedList;
}

function makeExpectedUserInformation(user) {
  return {
    first_name: user.first_name,
    email: user.email,
    location: user.location,
    radius: user.radius
  }
}

function makeMaliciousPost(user) {
  const maliciousPost = {
    id: 911,
    user_id: user.id,
    post_type: 'request',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. Malicious post <script>alert("xss");</script>`,
    urgency: 'low',
    date_created: new Date(),
  }
  const expectedPost = {
    ...makeExpectedPosts([maliciousPost], user),
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. Malicious post &lt;script&gt;alert(\"xss\");&lt;/script&gt;`,
  }
  return expectedPost;
}

function makeFixtures() {
  const testUsers = makeUsersArray()
  const testPosts = makePostsArray(testUsers)
  const testCategories = makeCategoryArray()
  const testPostCategoryAssoc = makePostCategoryAssocArray(testPosts, testCategories)
  
  return { testUsers, testPosts, testCategories, testPostCategoryAssoc }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        community_users,
        community_posts,
        community_categories,
        community_categories_post_assoc
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE community_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE community_posts_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE community_categories_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE community_categories_post_assoc_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('community_users_id_seq', 0)`),
        trx.raw(`SELECT setval('community_posts_id_seq', 0)`),
        trx.raw(`SELECT setval('community_categories_id_seq', 0)`),
        trx.raw(`SELECT setval('community_categories_post_assoc_id_seq', 0)`),
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

function seedTables(db, users, posts, categories, category_post_assoc) {
  
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    
    await trx.into('community_users').insert(users)
    await trx.into('community_posts').insert(posts)
    await trx.into('community_categories').insert(categories)
    await trx.into('coordinator_categories_post_assoc').insert(category_post_assoc)
   

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
        [category_post_assoc[category_post_assoc.length - 1].id],
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
  makeExpectedPosts,
  makeExpectedUserInformation,
  makeMaliciousPost,
  makeFixtures,
  cleanTables,
  seedUsers,
  seedTables,
  makeAuthHeader,
}