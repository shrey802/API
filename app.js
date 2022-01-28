const express = require("express");
const nodemon = require("nodemon");
const axios = require("axios");
const cheerio = require("cheerio")
const app = express()
const newspapers = [
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change/',
    base: 'https://www.telegraph.co.uk'
  },
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis'

  },
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change'

  }
]
const articles = []

newspapers.forEach((item) => {
  axios.get(item.address)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html)
    $('a:contains("climate")', html).each( function (){
      const title = $(this).text()
      const url = $(this).attr('href')
      articles.push({
        title,
        url: item.base + url,
        source: item.name
      })
    })
  })
})
app.get("/", (req, res) => {
  res.send("hello")
})
app.get("/news", (req, res) => {
  res.json(articles)
})
app.get("/news/:newspaperID", async(req, res) => {
  const id = req.params.newspaperID
  const newspap = newspapers.filter(element => element.name == id)[0].address
  const bnews = newspapers.filter(element => element.name == id)[0].base
  axios.get(newspap)
  .then(respon => {
    const doc = respon.data
    const $ = cheerio.load(doc)
    const specificart = []
    $('a:contains("climate")', doc).each(function (){
      const specifictitle = $(this).text()
      const href = $(this).attr('href')
      specificart.push({
        title: specifictitle,
        url: bnews + href,
        source: newspap
      })
      res.json(specificart)
    })
  })
})
app.listen("3000", (req, res) => {
  console.log("port started")
})
