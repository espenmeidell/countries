import React, {useEffect, useState} from 'react';

function App() {

  const [sortBy, setSortBy] = useState<SortBy>("NAME")
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    fetch("https://restcountries.eu/rest/v2/all")
      .then(response => response.json())
      .then((values: Country[]) => setCountries(values))
  }, [])

  let sortedCountries = countries

  switch (sortBy) {
    case "NAME":
      sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name))
      break;
    case "POPULATION":
      sortedCountries = countries.sort((a, b) => {
        if (a.population < b.population) return 1
        if (a.population === b.population) return 0
        return -1
      })
      break;
    case "AREA":
      sortedCountries = countries.sort((a, b) => {
        if (a.area < b.area) return 1
        if (a.area === b.area) return 0
        return -1
      })

  }

  const averagePopulation = countries.reduce((sum, c) => sum + c.population, 0) / countries.length
  let largestArea = Number.NEGATIVE_INFINITY
  let largestAreaName = ""
  let smallestArea = Infinity
  let smallestAreaName = ""

  countries.forEach(country => {
    if (country.area >= largestArea){
      largestArea = country.area
      largestAreaName = country.name
    }
    if (country.area <= smallestArea) {
      smallestArea = country.area
      smallestAreaName = country.name
    }
  })


  const languages: Record<string, [string[], number]> =  {}
  countries.forEach(country => {
    country.languages.forEach(language => {
      const languageTuple = languages[language.name]
      if (languageTuple) {
        const [countryList, populationSum] = languageTuple
        languages[language.name] = [[...countryList, country.name], populationSum + country.population]
      } else {
        languages[language.name] = [[country.name], country.population]
      }
    })
  })

  return (
    <div className="App">
      <header className="App-header">
        <h1>Countries</h1>
      </header>
      <main>
        <section>
          Sort by:
          <label><input type={"radio"} name={"sort"} checked={sortBy === "NAME"} onChange={() => setSortBy("NAME")}/>Name</label>
          <label><input type={"radio"} name={"sort"} checked={sortBy === "AREA"} onChange={() => setSortBy("AREA")}/> Area</label>
          <label><input type={"radio"} name={"sort"} checked={sortBy === "POPULATION"} onChange={() => setSortBy("POPULATION")}/> Population</label>
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>Area</th>
              <th>Population (millions)</th>
            </tr>
            </thead>
            <tbody>
            {sortedCountries.map(country => <tr key={country.name}>
              <td>{country.name}</td>
              <td>{country.region}</td>
              <td>{Math.round(convertToSquareMiles(country.area))}</td>
              <td>{(country.population/1000000).toFixed(1)}</td>
            </tr>)}
            </tbody>
          </table>
        </section>
        <section>
          <h2>Summary</h2>
          <ul>
            <li>Average population: {averagePopulation}</li>
            <li>Smallest area: {smallestAreaName}</li>
            <li>Largest area: {largestAreaName}</li>
          </ul>
        </section>
        <section>
          <h2>Languages</h2>
          <table>
            <thead>
            <tr>
              <th>Language</th>
              <th>Countries</th>
              <th>Population (millions)</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(languages).map(([language, [countryList, population]]) => {
              return <tr key={language}>
                <td>{language}</td>
                <td>{countryList.join(", ")}</td>
                <td>{(population/1000000).toFixed(1)}</td>
              </tr>
            })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function convertToSquareMiles(km2: number): number {
  const m2 = km2 * 1e6
  return m2 / 2_589_988
}


type Language = {
  iso639_1: string;
  iso639_2: string;
  name: string;
  nativeName: string;
}

type Country = {
  name: string;
  region: string;
  population: number;
  area: number;
  languages: Language[];
}



type SortBy = "NAME" | "POPULATION" | "AREA"

export default App;
