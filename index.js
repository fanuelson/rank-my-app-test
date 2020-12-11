const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.get("/characters", async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5;

  const response = await axios.get("https://rickandmortyapi.com/api/character");

  const characters = response.data.results;
  const charactersMapped = characters.map((character) => {
    return {
      id: character.id,
      name: character.name,
      status: character.status,
      especie: character.species,
      type: character.type,
      gender: character.gender,
      location: character.location,
    };
  });

  //   PAGINATE
  const charactersMappedPaginated = charactersMapped.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  res.send(charactersMappedPaginated);
});

app.get("/characters/:id/episodes", async (req, res) => {
  const characterId = req.params.id;

  const charResponse = await axios.get(`https://rickandmortyapi.com/api/character/${characterId}`);
  const character = charResponse.data;

  const episodesUrl = character.episode;

  const episodesId = episodesUrl.map((episodeUrl) => {
    const episodeUrlSpplited = episodeUrl.split("/");
    return episodeUrlSpplited[episodeUrlSpplited.length - 1];
  });

  const episodesResponse = await axios.get(`https://rickandmortyapi.com/api/episode/${episodesId.join(",")}`);

  res.send({
    characterName: character.name,
    episodes: episodesResponse.data,
  });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
