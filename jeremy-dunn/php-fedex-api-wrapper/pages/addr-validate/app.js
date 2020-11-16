// pages/addr-validate/app.js

var app = new Vue({
  el: '#app',
  data: {
    settingsName:'addr-validate-fullSettings',
    working:false,
    addr1:'',
    addr2:'',
    city:'',
    state:'',
    zip:'',
    response_json:'',
    response:{}
  },

  mounted: function()
  {
    this.settings_recall( ) ;
  },

  methods:
  {
    async addrValidate_click( )
    {
      this.settings_store( ) ;
      const url = "../../php/address-validation.php";

      const params = {
        proc: 'repuser_Select', getJson:'Y', addr1:this.addr1, addr2:this.addr2,
        city: this.city, state:this.state, zip:this.zip
      };
      const query = object_toQueryString(params);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: query
      });

      this.response_json = (await response.text()).trim( ) ;
      this.response = JSON.parse(this.response_json);
    },

    filterSettings( )
    {
      const filterSettings = this.refs.filter.getFilterSettings();
      return filterSettings ;
    },

    responseProperties( )
    {
      const response_items = [] ;
      const keys = Object.keys(this.response) ;
      for( const key of keys )
      {
        const vlu = this.response[key] ;
        const item = {key, vlu} ;
        response_items.push(item) ;
      }
      return response_items ;
    },

    objectProperties( obj )
    {
      const propArr = [] ;
      const keys = Object.keys(obj);
      for( const key of keys )
      {
        const vlu = obj[key] ;
        const item = {key, vlu} ;
        propArr.push(item) ;
      }
      return propArr ;
    },

    settings_recall( )
    {
      var itemText = localStorage.getItem( this.settingsName) ;
      if ( itemText )
      {
        const fullSettings = JSON.parse(itemText) ;
        {
          this.addr1 = fullSettings.addr1 || '' ;
          this.addr2 = fullSettings.addr2 || '' ;
          this.city = fullSettings.city || '' ;
          this.state = fullSettings.state || '' ;
          this.zip = fullSettings.zip || '' ;
        }
      }
    },
  
    settings_store( )
    {
      const filterSettings = {} ;
      const fullSettings = {filterSettings, addr1:this.addr1, addr2:this.addr2,
        city:this.city, state:this.state, zip:this.zip } ;
      localStorage.setItem( this.settingsName, JSON.stringify(fullSettings)) ;
    },
  
  }
})
