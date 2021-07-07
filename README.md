### Project boilerplate using NextJs, Auth0, Prisma, Apollo & Typescript

Inspired By [https://github.com/dijonmusters/courses](https://github.com/dijonmusters/courses)

Recommendations

- DB = [supabase](https://supabase.io/) - open source version of firebase

`.env` variables needed

```
DATABASE_URL=""

AUTH0_HOOK_SECRET=""
AUTH0_SECRET=''
AUTH0_BASE_URL=''
AUTH0_ISSUER_BASE_URL='https://YOUR_URL.auth0.com'
AUTH0_CLIENT_ID=''
AUTH0_CLIENT_SECRET=''
```

### Step 1 - Auth0

1. Creat an Auth0 tenant
2. Create the Auth0 app and update the appropriate `.env` variables
3. Create the Auth0 api
4. Create permissions for the api e.g. `read:user`, `edit:user` and create roles `admin` and `user` and assigne them appropriate permissions
5. Follow the [nextjs-auth0](https://github.com/auth0/nextjs-auth0/blob/main/README.md) set up guide
6. Add rules (see rules below)
7. Add `AUTH0_HOOK_SECRET` key to rules page

**Rule One - Set roles to a user**

```
function setRolesToUser(user, context, callback) {

  // Roles should only be set to verified users.
  if (!user.email) {
    return callback(null, user, context);
  }

  user.app_metadata = user.app_metadata || {};
  // You can add a Role based on what you want
  // In this case I check domain
  const addRolesToUser = function (user) {
    const endsWith = 'yourAdminUser@email.com';

    if (
      user.email &&
      user.email.substring(
        user.email.length - endsWith.length,
        user.email.length
      ) === endsWith
    ) {
      return ['admin'];
    }
    return ['user'];
  };

  const roles = addRolesToUser(user);

  user.app_metadata.roles = roles;
  auth0.users
    .updateAppMetadata(user.user_id, user.app_metadata)
    .then(function () {
      context.idToken['https://APP_DOMAIN/roles'] = user.app_metadata.roles;
      callback(null, user, context);
    })
    .catch(function (err) {
      callback(err);
    });
}
```

**Rule TWO - Create User in DB**

the `URL_OF_API` of `localhost` wont work, so when developing locally you will need to use **Ngrok**. Install it with `npm i -g ngrok` and then run it `ngrok http 3000` or whatever your localhost port is running on. That should give you a url to use when developing locally, but the `URL_OF_API` below will need to be set to the production endpoint when

```
async function (user, context, callback) {
  user.app_metadata = user.app_metadata || {};

  if (!user.app_metadata.localUserCreated) {
    await request.post('http://URL_OF_API/api/auth/hooks', {
      body: JSON.stringify({
        email: user.email,
        email_verified:user.email_verified,
        picture:user.picture,
        secret: configuration.AUTH0_HOOK_SECRET,
      })
    });
    user.app_metadata.localUserCreated = true;
    await auth0.users.updateAppMetadata(user.user_id, user.app_metadata);
  }
  callback(null, user, context);
}
```

### Step 2 - DB

1. Create a supabase account and create a db make sure to remember the password
2. Add in the `db connecting string` to the `DATABASE_URL` env variable and update the password where suggested
3. run `npx prisma db push`
4. run `npx prisma generate`

### Step 3 - Run the app

run `npm run dev`
