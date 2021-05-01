

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
  searchBar:function(){
    return `
    <p><a href="/"><h1>stocker</h1></a></p>
    <form action="/">
    <input type="text" name="search">
    <input type="submit">
    </form>
    `;
  }
};