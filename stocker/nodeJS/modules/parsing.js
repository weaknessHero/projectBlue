module.exports = {
  CSVtoTable:function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    var table = '<table>';
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      if (singleRow === 0) {
        table += '<thead>';
        table += '<tr>';
        var rowCells = allRows[singleRow].split(',');
      } else {
        table += '<tr>';

        //regular expression
        allRows[singleRow]=allRows[singleRow].replace(/,"/gi, '/');
        allRows[singleRow]=allRows[singleRow].replace(/",/gi, '/');
        allRows[singleRow]=allRows[singleRow].replace(/"/gi, '');
        allRows[singleRow]=allRows[singleRow].replace(/,/gi, '');
        var rowCells = allRows[singleRow].split('/');
      }

      for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
        if (singleRow === 0) {
          if(rowCell===0){
            table += '<th>';
            table += rowCells[rowCell]
            table += '</th>';
          } else{
            table += '<th>';
            table += rowCells[rowCell].substring(0,4)+"년도 "+rowCells[rowCell].substring(4,5)+"분기";
            table += '</th>';
          }
        } else {
          if(rowCell===0){
            table += '<th>';
            table += rowCells[rowCell]
            table += '</th>';
          } else{
            table += '<td>';
            table += rowCells[rowCell].substring(rowCells[rowCell].length-8,8-rowCells[rowCell].length);
            table += '</td>';
          }
        }
      }
      if (singleRow === 0) {
        table += '</tr>';
        table += '</thead>';
        table += '<tbody>';
      } else {
        table += '</tr>';
      }
    } 
    table += '</tbody>';
    table += '</table>';
    return table;
    
  }
}