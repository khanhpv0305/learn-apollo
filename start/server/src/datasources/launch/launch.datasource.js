const {RESTDataSource} = require('apollo-datasource-rest')
const {normalize} = require('normalizr')

const schema = require('./launch.schema')

class LaunchAPI extends RESTDataSource {
  constructor() {
    super()

    this.baseURL = 'https://api.spacexdata.com/v2'
    this.schema = schema
  }

  async getAllLaunches() {
    const response = await this.get('/launches')

    return Array.isArray(response)
      ? response.map(launch => this.launchReducer(launch))
      : []
  }

  launchReducer(launch) {
    const normalizedLaunch = normalize(launch, this.schema)

    console.log(normalizedLaunch)

    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    }
  }
}

module.exports = LaunchAPI
