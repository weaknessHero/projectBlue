

module.exports = {
  HTML:function(JS,CSS,...list){
    var templet=`<!DOCTYPE html>
      <html lang='ko'>
        <head>
          <meta charset="utf-8">
          <title>STOCKER</title>
          <script src="${JS}" defer></script>
          <link href="${CSS}" rel="stylesheet" type="text/css">
        </head>
        <body>
        `
    for (var i in list){
      templet+=list[i];
    }
    templet+= `
      </body>
    </html> `;
  
    return templet;
  },
  searchBar:function(value){
    if (value===undefined){
      value=""
    }
    return `
    <div id="searchBar">
    <form action="/search" >
      <input type="text" name="searchId" value=${value}>
      <button type="submit"><img src="/IMG/searchICon.png" style="width:50px;height:50px;"></img></button>
    </form>
    </div>
    `;
  },
  logo:function(){
    return`<div class=topDiv><a href="/"><div class='logo'>STOCKER</div></a></div>`
  }
};