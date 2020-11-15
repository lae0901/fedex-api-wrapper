// pages/addr-validate/app.js

var app = new Vue({
  el: '#app',
  data: {
    settingsName:'addr-validate-fullSettings',
    working:false,
  },

  mounted: function()
  {
    this.settings_recall( ) ;
  },

  methods:
  {
    async addrValidate_click( )
    {
      const url = "../../examples/address-validation.php";

      const params = {
        proc: 'repuser_Select', getJson:'Y'
      };
      const query = object_toQueryString(params);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: query
      });

      const respText = await response.text();
      const rows = JSON.parse(respText);
    },

    filterSettings( )
    {
      const filterSettings = this.refs.filter.getFilterSettings();
      return filterSettings ;
    },

    settings_recall( )
    {
      var itemText = localStorage.getItem( this.settingsName) ;
      if ( itemText )
      {
        const fullSettings = JSON.parse(itemText) ;
        {
        }
        this.refs.filter.setFilterSettings( fullSettings.filterSettings ) ;
      }
    },
  
    settings_store( )
    {
      const filterSettings = this.refs.filter.getFilterSettings( ) ;
      const fullSettings = {filterSettings } ;
      localStorage.setItem( this.settingsName, JSON.stringify(fullSettings)) ;
    },
  
  }
})
