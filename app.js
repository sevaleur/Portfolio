require('dotenv').config()

const fetch = require('node-fetch')

const { createClient } = require('@sanity/client')
const urlBuilder = require('@sanity/image-url')

const express = require('express')
const app = express()

const path = require('path')
const device = require('express-device')

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(device.capture())

const endpoint = process.env.ENDPOINT
const projectId = process.env.PROJECT_ID
const dataset = process.env.DATASET
const apiVersion = process.env.API_VERSION

const client = createClient({
  projectId, 
  dataset, 
  apiVersion, 
  useCdn: true
})

const build = urlBuilder(client)

this.assets = []

const url = (query) => 
{
  return fetch(
    `${endpoint}${query}`
  )
    .then(
      (res) => 
        res.json()
    )
}

const linkResolver = doc =>
{
  switch(doc._type)
  {
    case 'about': 
      return '/about'
      break 
    case 'project': 
      return `/project/${doc.slug}`
      break 
    case 'projects': 
      return '/projects'
      break 
    default: 
      return '/'
      break
  }
}

app.use((req, res, next) => {
  res.locals.Link = linkResolver
  res.locals.Build = build

  next()
})

const handleAssets = async() => 
{
  const all_projects = await url(
    encodeURIComponent(
      `*[_type == "project"]{
        image,
        preview, 
        linkIcon
      }`
    )
  )
  all_projects.result.forEach(
    project => 
    {
      let src = build.image(project.image.asset._ref).url()
      let prevSrc = build.image(project.preview.asset._ref).url()
  
      if(!this.assets.includes(src))
        this.assets.push(src)

      if(!this.assets.includes(prevSrc))
        this.assets.push(prevSrc)
    }
  )

  let projectIcon = build.image(all_projects.result[0].linkIcon.asset._ref).url()

  if(!this.assets.includes(projectIcon))
    this.assets.push(projectIcon)


  const about = await url(
    encodeURIComponent(
      `*[_type == "about"]{
        image
      }`
    )
  )

  let portrait = build.image(about.result[0].image.asset._ref).url()
  
  if(!this.assets.includes(portrait))
    this.assets.push(portrait)
}

const handleReq = async(req) => 
{
  await handleAssets()

  const meta = await url(
    encodeURIComponent(
      `*[_type == "metadata"]`
    )
  )

  const navigation = await url(
    encodeURIComponent(
      `*[_type == "navigation"]{
        ..., 
        nav_items[] ->
      }`
    )
  )
  
  return {
    meta: meta.result[0],
    navigation: navigation.result[0],
    assets: this.assets, 
    device: req.device.type
  }
}

app.get('/', async(req, res) =>
{
  const partials = await handleReq(req)
  const home = await url(
    encodeURIComponent(
      `*[_type == "home"]`
    )
  )

  res.render('pages/home',
  {
    ...partials,
    home: home.result[0],
  })
})

app.get('/projects', async(req, res) =>
{
  const partials = await handleReq(req)
  const projectss = await url(
    encodeURIComponent(
      `*[_type == "projects"]{
        ..., 
        showcase[]-> {
          _type, 
          title, 
          preview, 
          demo,
          "slug": slug.current
        }
      }`
    )
  )

  res.render('pages/projects',
  {
    ...partials,
    projects: projectss.result[0]
  })
})

app.get('/project/:uid', async(req, res) =>
{
  const partials = await handleReq(req)
  const project = await url(
    encodeURIComponent(
      `*[_type == "project"
        && slug.current == "${req.params.uid}"
      ]`
    )
  )

  res.render('pages/project', {
    ...partials,
    project: project.result[0]
  })
})

app.get('/about', async(req, res) => 
{
  const partials = await handleReq(req)
  const about = await url(
    encodeURIComponent(
      `*[_type == "about"]`
    )
  )

  res.render('pages/about', {
    ...partials, 
    about: about.result[0]
  })
})

app.listen(process.env.PORT, () =>
{
  console.log(`Listening at http://localhost:3000`)
})
