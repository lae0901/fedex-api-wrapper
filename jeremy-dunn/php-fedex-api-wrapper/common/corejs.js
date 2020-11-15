// corejs.js - string, array, object, ... functions

// ------------------------- array_findLastIndex ---------------------------
// search array from back to front.  Return the index of the first item found
// ( the last matching item in the array )
function array_findLastIndex( arr, matchFunc )
{
  var lastMatchIx = -1 ;
  var ix = arr.length - 1 ;
  for( ; ix >= 0 ; ix-- )
  {
    var item = arr[ix] ;
    if ( matchFunc(item) == true )
    {
      lastMatchIx = ix ;
      break ;
    }
  }

  return lastMatchIx ;
}

// ------------------------------- array_findAndSplice ----------------------------
// find index of item in array where func(item) == true. Then use splice to remove
// that found item.
function array_findAndSplice( arr, func )
{
  const fx = arr.findIndex( func ) ;
  if ( fx != -1 )
    arr.splice(fx, 1 ) ;
}

// ------------------------------------ array_first -------------------------------
// return the first item in the array.
function array_first( arr, def )
{
  if ( arr.length > 0 )
    return arr[0] ;
  else
    return def ;
}

// ------------------------------- array_getSingleItem ----------------------------
// variable is expected to be an array with a single element. Return that single 
// item or otherwise, return null.
function array_getSingleItem( arr )
{
  if ( Array.isArray(arr) && arr.length == 1 )
    return arr[0] ;
  else
    return null ;
}

// ------------------------------- array_last -----------------------------
// return last item in the array.
function array_last( arr )
{
  if ( arr.length == 0 )
    return null ;
  else
  {
    const ix = arr.length - 1 ;
    return arr[ix] ;
  }
}

// ----------------------------- array_nextItem ---------------------------
// return either next item from array or the value of non array.
// function used to "return next" when input value is array or not.
// return eof when past end of array.
// when not an array, return eof depending on if the input index is zero or not.
function array_nextItem( arr, ix )
{
  let eof = false ;
  let next_ix = -1 ;
  let item ;
  if (Array.isArray(arr))
  {
    if ( ix >= arr.length )
    {
      next_ix = -1 ;
      item = null ;
      eof = true ;
    }
    else
    {
      item = arr[ix] ;
      next_ix = ix + 1 ;
      eof = false ;
    }
  }
  else
  {
    if ( ix == 0 )
    {
      eof = false ;
      item = arr ;
      next_ix = ix + 1 ;
    }
    else
    {
      eof = true ;
      item = null ;
      next_ix = -1 ;
    }
  }

  return {item, next_ix, eof } ;
}

// ------------------------------ array_range ----------------------------------
// return range of items where selectFunction returns true in some items.
function array_range(arr, selectFunction)
{
  let from_index = -1;
  let to_index = -1;
  let count = 0;
  let from_item = null;
  let to_item = null;
  for (let ix = 0; ix < arr.length; ++ix)
  {
    const item = arr[ix];
    if (selectFunction(item))
    {
      // first item that is true.
      if (from_index == -1)
      {
        from_index = ix;
        from_item = item;
      }

      // extend range of items to last that is true.
      to_index = ix;
      to_item = item;
      count = to_index - from_index + 1;
    }

  }

  return { from_index, to_index, count, from_item, to_item };
}

// ---------------------------- array_remove ------------------------------
// remove items from array.  Return new array with remaining items.
function array_remove(arr, ix, lx = 1)
{
  let afterBx = ix + lx;
  if ((ix == 0) && (afterBx >= arr.length))
    return [];
  else if (ix == 0)
    return arr.slice(afterBx);
  else if (afterBx >= arr.length)
    return arr.slice(0, ix);
  else
    return [...arr.slice(0, ix), ...arr.slice(afterBx)];
}

// ------------------------- arrayBuffer_download ---------------------------------
function arrayBuffer_download(buf, fileName)
{
  const promise = new Promise(async (resolve, reject) =>
  {
    // the extension of the file being downloaded.
    const ext = path_getExtension(fileName).toLowerCase( ) ;

    // create a blob
    let date = null;
    if ((ext == 'xlsx') || (ext == 'xls'))
      data = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    else if (ext == 'pdf')
      data = new Blob([buf], { type: 'application/pdf' });
    else
      data = new Blob([buf], { type: 'text/plain;charset=utf-8' });

    // build anchor tag and attach file (works in chrome)
    const a = document.createElement("a");

    var url = URL.createObjectURL(data);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() =>
    {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      resolve();
    }, 1000);
  });
  return promise;
}

// ------------------------------ arrayString_findAny ----------------------------
// search the array of strings.  Looking for item in the array of strings that is
// equal any of the pattern of strings.
function arrayString_findAny( arrayString, anyPat )
{
  let foundIx = -1 ;
  for( let ix = 0 ; ix < arrayString.length ; ++ix )
  {
    let item = arrayString[ix] ;
    let fx = anyPat.findIndex((pat) => 
    {
      return ( pat == item ) ;
    });
    if ( fx >= 0 )
    {
      foundIx = ix ;
      break ;
    }
  }
  return foundIx ;
}

// --------------------------- attachFile_writeToIfs --------------------------------
async function attachFile_writeToIfs(file, fileType, toDirPath, fileName)
{
  let toIfsPath = '';
  if (fileType == 'pdf')
  {
    toIfsPath = await pdf_writeToIfs(file, toDirPath, fileName);
  }
  else if (fileType == 'excel')
  {
    toIfsPath = await excel_writeToIfs(file, toDirPath, fileName);
  }
  return toIfsPath;
}

// ---------------------------- bool_toggle ----------------------------
// toggle value between true and false.
function bool_toggle(vlu, trueVlu = true, falseVlu = false)
{
  if (vlu == trueVlu)
    return falseVlu;
  else
    return trueVlu;
}

// ------------------------------ bool_ToYN ---------------------------
// return Y or N depending on input boolean value
function bool_ToYN( boolValue )
{
  if ( boolValue == true )
    return 'Y' ;
  else
    return 'N' ;
}

// -------------- bool_radioRadioAll_applyChange -------------------------
// experimental.  Trying to encapsulate the behavior or two radio buttons and one
// all button.
// when change radio1, toggle radio2 and turn off all.
// when change radio2, toggle radio1 and turn off all.
// when turn on all, turn on radio1 and radio2.
function bool_radioRadioAll_applyChange( radio1, radio2, all, which, vlu )
{
  if ( which == 'r1')
  {
    if ( vlu == true )
    {
      radio1 = true ;
      radio2 = false ;
      all = false ;
    }
  }

  return {radio1, radio2, all } ;
}

// ------------------------- char_isLetter ---------------------------
// return true if character is a letter, a-z or A-Z.
function char_isLetter( ch1 )
{
  if (( ch1 >= 'a') && ( ch1 <= 'z'))
    return true ;
  else if ((ch1 >= 'A') && ( ch1 <= 'Z'))
    return true ;
  else
    return false ;
}

// --------------------------- core_generateUUID --------------------------
function core_generateUUID()
{
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function')
  {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
  {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ---------------------------------- core_webServiceGet ------------------------
// use GET method to call web service. When promise resolves, returns {respText}
// options: { respForm:'json' 'text' 'blob' }
function core_webServiceGet(url, params, options)
{
  options = options || {};
  options.method = 'GET';
  const promise = core_webService_common(url, params, options);
  return promise;
}

// ---------------------------------- core_webServicePost ------------------------
// use POST method to call web service. When promise resolves, returns {respText}
// options: { respForm:'json' 'text' 'blob' }
function core_webServicePost(url, params, options)
{
  options = options || {};
  options.method = 'POST';
  const promise = core_webService_common(url, params, options);
  return promise;
}

// ------------------------------ core_webService_common ------------------------
// use GET or POST method to call web service. 
// When promise resolves, returns {respText}
// options: { respForm:'json' 'text', method:'GET' 'POST' }
function core_webService_common(url, params, options)
{
  const promise = new Promise(async (resolve, reject) =>
  {
    params.webFile = params.webFile || '';
    const query = object_toQueryString(params);
    const method = options.method;
    const respForm = options.respForm || 'json';
    const saveFile = options.saveFile || false ;
    let response;

    if (method == 'GET')
    {
      const url_query = url + '?' + query;
      response = await fetch(url_query,
        {
          method,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
    }
    else if (method == 'POST')
    {
      response = await fetch(url,
        {
          method,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: query
        });
    }

    if ( respForm == 'blob')
    {
      let attachment_filename = response_attachmentFilename(response) ;

      const blob = await response.blob();
      if ( saveFile )
      {
        response_saveAs(blob, attachment_filename) ;
        resolve( ) ;
      }
      else
      {
        resolve(blob);
      }
    }
    else
    {
      const respText = await response.text();

      // got nothing back. call same web service again, this time with joblog option.
      if ((respForm == 'json') && (respText.length == 0) && (params.joblog != 'Y'))
      {
        params.joblog = 'Y';
        params.debug = 'Y';
        await core_webService_common(url, params, options);
        reject('error');
      }

      if (respForm == 'text')
        resolve(respText)
      else
      {
        const { jsonText, errText } = respText_extractErrorText(respText);

        if (errText)
        {
          const errInfo = `proc: ${params.proc || ''}
          sql: ${params.sql || ''}
          libl: ${params.libl || ''}\n`;
          const errText2 = errInfo + string_replaceAll(errText, '<br />', '\r\n');
          window_download(errText2, 'errText.txt');
        }

        const resp = JSON.parse(jsonText);

        const typeOf = typeof resp;
        if (Array.isArray(resp))
          resolve(resp);

        // response object contains a joblog.
        else if (resp.joblog)
        {
          const joblog = resp.joblog;

          // download the joblog as a text file.
          const errInfo = `proc: ${params.proc || ''}\r\nsql: ${params.sql || ''}\r\n}`;
          let textStream = errInfo;
          joblog.forEach((item) =>
          {
            textStream += item.LINE + '\r\n';
          })
          window_download(textStream, 'joblog.txt');

          resolve(resp.rows || resp.set1);
        }
        else
          resolve(resp);
      }
    }
  });
  return promise;
}

// ------------------------------------ response_saveAs ------------------------------------
// create a temporary <a> element in the DOM and run code that enables the browser
// to save the passed in object ( blob ) as if it was downloaded by clicking on the
// <a> link.
function response_saveAs(blob, name, opts)
{
  var a = document.createElement('a')
  name = name || blob.name || 'download'

  a.download = name
  a.rel = 'noopener' // tabnabbing

  {
    a.href = window.URL.createObjectURL(blob);
    setTimeout(function () { window.URL.revokeObjectURL(a.href) }, 4E4); // 40s
    setTimeout(function () { a.click( ); }, 0);
  }
}

// -------------------------- response_attachmentFilename --------------------------
// search thru the response header entries. Looking for attachment file name.
function response_attachmentFilename( response )
{
  let attachment_filename = '';
  for (const pair of response.headers.entries())
  {
    if (pair[0] == 'content-disposition')
    {
      const vlu = pair[1];
      const fx = vlu.indexOf('filename=');
      if (fx != -1)
      {
        attachment_filename = vlu.substr(fx + 9);
        break;
      }
    }
  }
  return attachment_filename;
}

// ------------------- respText_extractErrorText ---------------------------
function respText_extractErrorText(respText)
{
  let errText = '';
  let jsonText = '';
  if ((respText) && (respText.length > 0) && (respText.substr(0, 1) == '<'))
  {
    const lines = respText.split('\n');
    for (let ix = 0; ix < lines.length; ++ix)
    {
      const line = lines[ix];
      if (line.substr(0, 1) == '<')
        errText += line;
      else
        jsonText = line;
    }
  }
  else
  {
    jsonText = respText;
  }
  return { jsonText, errText };
}

// ------------------------- csv_toObjectArray ------------------------------
// transform the csv string to an array of line items. Then transform each line
// item array to an object where items in the array are converted to columns.
// Quoted strings are dequoted.
// By default, the property names are item1, item2, item3, ...
// If the CSV has a column heading line, the names of the properties is the column
// heading text.
// filterEmpty option is used to remove rows where there are no columns or all the
// columns are empty strings.
// option: {hasColumnHeadingLine:false, filterEmpty:true/false, csvColDelim:',' }
// returns objectArray
function csv_toObjectArray( csvText, options )
{
  options = options || {} ;
  var hasColumnHeadingLine = options.hasColumnHeadingLine || false ;
  var filterEmpty = options.filterEmpty || true ;
  var csvColDelim = options.csvColDelim || ',' ;
  let colNameArray = options.colNames || [] ;

  // parse the csv string.  output is an array of arrays. 
  var lineArray = csv_toArrayOfArray( csvText, csvColDelim ) ;

  // the transform to object array
  var objectArray = [] ;

  // loop for each array that contains results of parsing each line in csv string.
  for( var ix = 0 ; ix < lineArray.length ; ++ix )
  {
    var line = lineArray[ix] ;

    var toObj = {} ;
    var itemNum = 0 ;
    var allEmpty = true ;
    for( var jx = 0 ; jx < line.length ; ++jx )
    {
      var item = string_TrimBlanks(line[jx]) ;
      if ( string_isQuoted(item))
        item = string_dequote(item) ;

      // store item in object.
      itemNum += 1 ;
      let propName ;
      if (itemNum <= colNameArray.length)
        propName = colNameArray[itemNum - 1] ;
      else
        propName = 'item' + itemNum ;
      toObj[propName] = item ;

      // keep track that all items are empty.
      var isEmpty = false ;
      if (((typeof item) == 'string') && ( item.length == 0 ))
      {}
      else
      {
        allEmpty = false ;
      }
    }

    // push the object onto objectArray.
    if (( filterEmpty == false) || ( allEmpty == false ))
      objectArray.push( toObj ) ;
  }

  return objectArray ;
}

// -------------------------- csv_toArrayOfArray ----------------------------------
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function csv_toArrayOfArray( strData, strDelimiter )
{
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
      (
          // Delimiters.
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

          // Standard fields.
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ), "gi");

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData ))
  {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
        )
    {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );
    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ])
    {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[ 2 ].replace(
          new RegExp( "\"\"", "g" ), "\"" );
    }
    else
    {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[ 3 ];
    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return( arrData );
}

// ------------------------------- date_check_toISO -----------------------------
// check that input date is valid. return errmsg or date in ISO form.
// date_name : name of the date field. if specified will include in the errmsg.
function date_check_toISO(inDate, date_name)
{
  date_name = date_name || 'date';
  let errmsg = '';
  let iso_date = '';

  // create date object from input date.
  let dt;
  try
  {
    dt = new Date(inDate);
  }
  catch (ex)
  {
    errmsg = `invalid ${date_name}. ` + inDate.toString();
  }

  // check that dt is actually a date object.
  if (((dt instanceof Date) && (isFinite(dt))) == false)
    errmsg = `invalid ${date_name}. ` + inDate.toString();

  // a valid date. convert to iso.
  if (dt)
  {
    iso_date = date_toIso(dt);
  }

  return { errmsg, iso_date };
}

// --------------------------------- date_fromISO ------------------------------------
// build Date object from yy, mm, dd parts of ISO date.
// iso_time: time of day in hh:mm:ss form.
function date_fromISO( iso, iso_time )
{
  let dt ;
  const yr = iso.substr(0,4) ;
  const mm = iso.substr(5,2) - 1 ;
  const dd = iso.substr(8,2) ;

  if ( iso_time )
  {
    const hr = iso_time.substr(0,2) ;
    const min = iso_time.substr(3,2) ;
    const sec = iso_time.substr(6,2) ;
    dt = new Date(yr,mm,dd, hr, min, sec ) ;
  }
  else
  {
    dt = new Date(yr,mm,dd) ;
  }

  return dt ;
}

// ---------------------------- date_currentIso -------------------------------
function date_currentIso( )
{
  let dt = new Date( ) ;
  return date_toIso(dt) ;
}

// --------------------------- date_monthLastDay ---------------------------
// return new date which is set to the last day of the month of the input date.
function date_monthLastDay(dt)
{
  let yy = dt.getFullYear();
  let mm = dt.getMonth();
  let d = new Date(yy, mm + 1, 0);
  return d;
}

// --------------------------- date_startNextMonth ---------------------------
function date_startNextMonth( dt )
{
  let yy = dt.getFullYear( ) ;
  let mm = dt.getMonth( ) ;
  let d = new Date(yy,mm,1) ;
  d.setMonth( mm + 1 );
  return d ;
}

// --------------------- date_toIso -----------------------------
// convert date to ISO format. yyyy-mm=dd
function date_toIso(d)
{
  function pad(n) { return n < 10 ? '0' + n : n }

  return d.getUTCFullYear() + '-'
    + pad(d.getUTCMonth() + 1) + '-'
    + pad(d.getUTCDate());
}

// ------------------------------ date_toMonthNameString --------------------------
// date to month_name dd, yyyy form.
function date_toMonthNameString( dt )
{
  var yy = dt.getFullYear( ) ;
  var mm = dt.getMonth( ) ;
  var dd = dt.getDate( ) ;

  const monthNames = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
  var s1 = monthNames[mm] + ' ' + dd + ', ' + yy ;
  return s1 ;
}

// ------------------------------ date_toShortMonthNameString --------------------------
// date to month_name dd, yyyy form.
function date_toShortMonthNameString(dt)
{
  var yy = dt.getFullYear();
  var mm = dt.getMonth();
  var dd = dt.getDate();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var s1 = monthNames[mm] + ' ' + dd + ', ' + yy;
  return s1;
}

// ----------------------------- date_toTime24 -----------------------------------
// return time portion of date object in 24 hour time format.
function date_toTime24(dt)
{
  if (!dt )
    dt = new Date( ) ;
  const timeText = string_padLeft(dt.getHours(), 2, '0') +
    ':' + string_padLeft(dt.getMinutes(), 2, '0') +
    ':' + string_padLeft(dt.getSeconds(), 2, '0');
  return timeText;
}

// --------------------------- elem_applyFontStyles -----------------------------
// Apply all the font render styles, from one element to another.
function elem_applyFontStyles( toElem, fromElem )
{
  // We'll copy the properties below into the mirror div.
  // Note that some browsers, such as Firefox, do not concatenate properties
  // into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
  // so we have to list every single property explicitly.
  const properties = [
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',  // might not make a difference, but better be safe

    'letterSpacing',
    'wordSpacing',
    'tabSize',
    'MozTabSize'
  ];

  const style = toElem.style;
  const computed = window.getComputedStyle ? window.getComputedStyle(fromElem) 
                    : fromElem.currentStyle;  // currentStyle for IE < 9

  // Transfer the fromElem's properties to the div
  properties.forEach(function (prop)
  {
    style[prop] = computed[prop];
  });
}

// --------------------------- elem_applyRenderStyles -----------------------------
// Apply all the render styles, from one element to another.
// Purpose is so that the render height and width of the to element will match that
// of the from element.
function elem_applyRenderStyles(toElem, fromElem)
{
  // We'll copy the properties below into the mirror div.
  // Note that some browsers, such as Firefox, do not concatenate properties
  // into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
  // so we have to list every single property explicitly.
  const properties = [
    'direction',  // RTL support
    'boxSizing',
    'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    'height',
    'overflowX',
    'overflowY',  // copy the scrollbar for IE

    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',  // might not make a difference, but better be safe

    'letterSpacing',
    'wordSpacing',

    'tabSize',
    'MozTabSize'
  ];

  const style = toElem.style;
  const computed = window.getComputedStyle ? window.getComputedStyle(fromElem)
    : fromElem.currentStyle;  // currentStyle for IE < 9
  const isInput = fromElem.nodeName === 'INPUT';

  // Transfer the fromElem's properties to the div
  properties.forEach(function (prop)
  {
    if (isInput && prop === 'lineHeight')
    {
      // Special case for <input>s because text is rendered centered and line height may be != height
      if (computed.boxSizing === "border-box")
      {
        const height = parseInt(computed.height);
        const outerHeight =
          parseInt(computed.paddingTop) +
          parseInt(computed.paddingBottom) +
          parseInt(computed.borderTopWidth) +
          parseInt(computed.borderBottomWidth);
        const targetHeight = outerHeight + parseInt(computed.lineHeight);
        if (height > targetHeight)
        {
          style.lineHeight = height - outerHeight + "px";
        } else if (height === targetHeight)
        {
          style.lineHeight = computed.lineHeight;
        } else
        {
          style.lineHeight = 0;
        }
      } else
      {
        style.lineHeight = computed.height;
      }
    }
    else
    {
      style[prop] = computed[prop];
    }
  });
}

// ------------------ elem_IsArgMatch -----------------------
// check that elem is a match according to arg object properties.
// ( see elem_DeepChildren function. a jQuery way of collecting all the DOM
//   elements that match selection criteria. )
function elem_IsArgMatch(elem, arg)
{
  var isMatch = true;

  var hasAttr = object_getProp(arg, 'hasAttr', '');
  var et = '';
  if ((arg != null) && ('et' in arg))
    et = arg.et.toUpperCase();

  // check that elemType matches the nodeName of the element.
  if ((et.length > 0) && (elem.nodeName != et))
    isMatch = false;

  // check that the element contains the specified attribute.
  if ((isMatch == true) && (hasAttr.length > 0))
  {
    var attr = elem.attributes.getNamedItem(hasAttr);
    if (attr == null)
      isMatch = false;
  }

  // check that the element contains the specified property.
  if ((isMatch == true) && ('hasProp' in arg))
  {
    var hasProp = arg.hasProp;
    if ((hasProp in elem) == false)
      isMatch = false;
  }

  return isMatch;
}

// ----------------- elem_deepChildren ----------
// return an array of deep children elements that match the search arg.
// et - elemtype ( DIV SPAN TD ... )
// hasAttr:'attr'      Check if element has specified attr name.
// hasProp:'propName'  Check if element contains specified property name
function elem_deepChildren(parent, arg = null, accumArray = null)
{
  var returnArray = false;
  if (accumArray == null)
  {
    accumArray = [];
    returnArray = true;
  }

  for (var ix = 0; ix < parent.children.length; ix++)
  {
    var child = parent.children[ix];
    var isMatch = elem_IsArgMatch(child, arg);

    // matching child found.
    if (isMatch == true)
    {
      accumArray.push(child);
    }

    // elem has children. process child elements.
    if (child.children.length > 0)
      elem_DeepChildren(child, arg, accumArray);
  }

  if (returnArray == true)
    return accumArray;
}

// ------------------------- elem_getAttrValue ---------------------------------
function elem_getAttrValue( elem, attrName )
{
  var vlu ;
  var attr = elem.attributes.getNamedItem( attrName ) ;
  if ( attr )
    vlu = attr.value ;
  return vlu ;
}

// ---------------------------------- elem_parent --------------------------------
// return closest parent element of elem where findFunc(parent) returns true.
function elem_parent( elem, findFunc )
{
  let parent = null ;
  let cur_elem = elem ;
  while( cur_elem != null && cur_elem.parentElement )
  {
    if ( findFunc( cur_elem.parentElement ))
    {
      parent = cur_elem.parentElement ;
      break ;
    }
    cur_elem = cur_elem.parentElement ;
  }
  return parent ;
}

// --------------------------- excel_browserDownload ------------------------------
// ( need to include excelJS library in the web page. )
// should change the name of this function. Name should reflect that the excel file
// is being downloaded.
function excel_browserDownload(wb, fileName)
{
  fileName = fileName || 'excelOutput' ;
  const promise = new Promise(async (resolve, reject) =>
  {
    wb.xlsx.writeBuffer(
      {
        base64: true
      })
      .then(function (xls64)
      {
        // build anchor tag and attach file (works in chrome)
        var a = document.createElement("a");
        var data = new Blob([xls64], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        var url = URL.createObjectURL(data);
        a.href = url;
        a.download = fileName + '.xlsx';
        document.body.appendChild(a);
        a.click();
        setTimeout(function ()
        {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          resolve();
        }, 1000);
      })
      .catch(function (error)
      {
        console.log(error.message);
        reject();
      });
  });
  return promise;
}

// -------------------------------- excel_writeToIfs ------------------------------
// convert the excel workbook to a blob.  Then upload the blob to the IFS. 
async function excel_writeToIfs(wb, toDirPath, fileName)
{
  let promise = new Promise(async (resolve, reject) =>
  {
    const toIfsPath = toDirPath + '/' + fileName;

    let xls64 = await wb.xlsx.writeBuffer({ base64: true });
    let blob = new Blob([xls64],
      { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    let fileType = 'excel';
    var reader = new FileReader();
    reader.onload = (event) =>
    {
      // upload to the server as a blob.
      $.ajax(
        {
          url: "../../../site/php/php_writeToIfs.php",
          type: 'POST',
          data: {
            fileName, toIfsPath, data: event.target.result
          },
          dataType: 'text',
          success: function (data, status, xhr) 
          {
            resolve(toIfsPath);
          }
        });
    };
    reader.readAsDataURL(blob);
  });
  return promise;
}

// ------------------------ funcArray_CallSync -------------------
// call the array of functions, one at a time.
// each function in the array accepts a single parm - function to be called when 
// the function completed.
function funcArray_CallSync( funcArray, arrayDoneFunc )
{
  funcArray_CallSync_Actual( funcArray, 0, arrayDoneFunc ) ;
}

// ------------------------ funcArray_CallSync_Actual -------------------
// call the array of functions, one at a time.
// each function in the array accepts a single parm - function to be called when 
// the function completed.
function funcArray_CallSync_Actual( funcArray, ix, arrayDoneFunc )
{
  if ( ix >= funcArray.length )
  {
    if ( arrayDoneFunc )
    {
      arrayDoneFunc( ) ;
    }
    return ;
  }

  // isolate the function from array of functions.
  var func = funcArray[ix];

  // call the function. the signature of the function is func( doneFunc )
  // when the function completes it calls the callback function. The callback
  // then does a recursive call to run this function to call the next function
  // in the funcArray.
  func( function()
  {
    ix = ix + 1 ;
   funcArray_CallSync_Actual( funcArray, ix, arrayDoneFunc ) ;
  });
}

// --------------------- ibmi_fetchRow -----------------------
// call procedure on ibmi.  return single row from result set.
function ibmi_fetchRow(proc, url, libl, params )
{
  const promise = new Promise(async (resolve, reject) =>
  {
    const fetch_params = {
      libl, proc, ...params 
    };
    const query = object_toQueryString(fetch_params);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: query
    });

    const respText = await response.text();
    const rows = JSON.parse(respText);
    const row = array_getSingleItem(rows);
    resolve(row);
  });

  return promise;
}

// --------------------- ibmi_fetchRows -----------------------
// call procedure on ibmi.  return rows from result set.
function ibmi_fetchRows(proc, url, libl, params)
{
  const promise = new Promise(async (resolve, reject) =>
  {
    const fetch_params = {
      libl, proc, ...params
    };
    const query = object_toQueryString(fetch_params);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: query
    });

    const respText = await response.text();
    const rows = JSON.parse(respText);
    resolve(rows);
  });

  return promise;
}

// ------------------------ image_getImage ----------------------------
function image_getImage( url )
{
  let promise = new Promise((resolve, reject) =>
  {
    var img = new Image();
    img.onError = function()
    {
      reject('Cannot load image: "' + url + '"');
    };
    img.onload = function()
    {
      resolve(img) ;
    };
    img.src = url;
  });
  return promise ;
}

// ------------------------ image_getImage ----------------------------
function image_getImage_callback( url, doneFunc )
{
  var img = new Image();
  img.onError = function()
  {
    alert('Cannot load image: "'+url+'"');
  };
  img.onload = function()
  {
    doneFunc(img);
  };
  img.src = url;
}

// ------------------------------ int_toHex ------------------------------
// convert int value to hex string.  Make sure an even number of hex characters.
// also, return as upper case.
function int_toHex( vlu )
{
  let text = vlu.toString(16) ;
  if (( text.length % 2 ) == 1 )
    text = '0' + text ;
  return text.toUpperCase( ) ;
}

// ----------------------------- joblog_toLineText -----------------------------
function joblog_toLineText(joblog)
{
  const { lineText } = joblog.reduce((rio, item) =>
  {
    rio.lineText += item.LINE + '\r\n';
    return rio;
  }, { lineText: '' });
  return lineText ;
}

// ------------------------ linkedList_append ------------------------------
// generic linked list. add item to the end of the list.
function linkedList_append( header, item )
{
  let lastItem = header.last ;
  linkedList_insertAfter( header, lastItem, item ) ;
}

// --------------------- linkedList_insertAfter ---------------------------
// header: {first, last }
// baseItem: { prev, next }
// insertItem: { prev, next }
function linkedList_insertAfter( header, baseItem, insertItem )
{
  let nextItem = null ;
  if ( baseItem )
  {
    nextItem = baseItem._next_;

    // base item points next to insert item.
    baseItem._next_ = insertItem;
  }

  // is no base item. Insert item is the first item.
  if ( !baseItem )
  {
    header.first = insertItem ;
  }

  // next item points back to insert item.
  if ( nextItem )
  {
    nextItem._prev_ = insertItem ;
  }

  // insert item prev and next pointers.
  insertItem._prev_ = baseItem ;
  insertItem._next_ = nextItem ;

  // is no next item. Insert item is now the last item.
  if ( !nextItem )
  {
    header.last = insertItem ;
  }
}

// ------------------------- linkedList_remove ----------------------------
// remove this item from the linked list.
// header: {first, last }
// item: { prev, next }
function linkedList_remove( header, item )
{
  let next = item._next_ ;
  let prev = item._prev_ ;

  // next item points back to prev.
  if ( next )
  {
    next._prev_ = prev ;
  }

  // prev item points forward to next.
  if ( prev )
  {
    prev._next_ = next ;
  }

  // is no next item. Item removed was last in the list.  That means the prev item
  // is now the last item.
  if ( !next )
  {
    header.last = prev ;
  }

  // is no prev item. Item removed was first in list. That means the next item is
  // now the first item.
  if ( !prev )
  {
    header.first = next ;
  }
}

// ---------------------- number_compare ------------------------------
// compare two number values for array.sort purposes.
function number_compare(a, b)
{
  a = a || 0 ;
  b = b || 0 ;
  if ( typeof a != 'number')
    a = Number(a) ;
  if ( typeof b != 'number')
    b = Number(b) ;

  if (a < b)
    return -1;
  else if (a == b)
    return 0;
  else
    return 1;
}

// ---------------------------- number_circularAdvance ----------------------------
// advanceDirection:'fwd'|'bwd',  range:{from:number, to:number}
function number_circularAdvance( num, advanceDirection, range )
{
  if ( advanceDirection == 'fwd')
  {
    num += 1 ;
    if ( num > range.to )
      num = range.from ;
  }
  else
  {
    num -= 1 ;
    if ( num < range.from )
      num = range.to ;
  }
  return num ;
}

// --------------------------- number_incrementNextMultiple ---------------------------
// check that number is even multiple of mult. If not, add the multiple value to
// the number rounded down to the multiple.
// ex: 30 = number_incrementNextMultiple( 25, 10 )
function number_incrementNextMultiple( num, mult )
{
  if ( typeof num != 'number')
    num = Number(num) ;
  const quotient = Math.floor( num / mult);
  return ( quotient + 1 ) * mult;
}

// ------------------------ number.format ------------------------
// get rid of this.  use static string_formatNumeric function instead.
Number.prototype.format = function(n, x)
{
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

// --------------------------------- object_apply ---------------------------------
// apply properties from the from object to the to object.
function object_apply( toObj, fromObj )
{
  for (const prop in fromObj)
  {
    toObj[prop] = fromObj[prop];
  }
}

// ------------------------------- object_currentChanged -----------------------
// compare properties in current object against properties in prev object.
// if any values changed, return true.
// note: do not check for properties in pv that are missing from cur. 
function object_currentChanged(cur, pv)
{
  if (pv == null)
    return true;
  for (const prop in cur)
  {
    vlu = cur[prop];
    pv_vlu = pv[prop];
    if (vlu && (vlu != pv_vlu))
      return true;
    else if (!vlu && pv_vlu)
      return true;
  }
  return false;
}

// ------------------- object_extend -------------------------------
//  no longer needed.  use ... spread operator instead.
//  const toObj = { ...fromObj1, ...fromObj2 }

// copy properties from fromObj1 and fromObj2 into toObj. then return the toObj.
// excl: properties to exclude from copy to target object.
// optn:{excl:[prop1,prop2]}
function object_extend( toObj, fromObj1, fromObj2, optn )
{
  optn = optn || {} ;
  excl = optn.excl;

  for( var prop in fromObj1 )
  {
    if ((excl) && ( excl.includes(prop)))
      continue ;
    toObj[prop] = fromObj1[prop] ;
  }

  if ( fromObj2 )
  {
    for( var prop in fromObj2 )
    {
      if ((excl) && ( excl.includes(prop)))
        continue ;
      toObj[prop] = fromObj2[prop] ;
    }
  }

  return toObj ;
}

// --------------------- object_getProp ------------------
// return value of property of object. If property does not exist,
// return default value.
function object_getProp(obj, propName, dftVlu)
{
  if (!obj)
    return dftVlu;
  else if (propName in obj)
    return obj[propName];
  else
    return dftVlu;
}

// ------------------------------ object_isEmpty -------------------------------
// check that object has no properties.
// ( if obj is null or undefined, consider empty. )
function object_isEmpty( obj )
{
  if ( !obj )
    return true ;
  else
    return (Object.keys(obj).length == 0);
}

// ----------------------- object_nullProps ------------------------
// set all the properties of an object to null.
function object_nullProps(obj, exclPropNames)
{
  for (let key in obj)
  {
    let excl = false;
    if ((exclPropNames) && (exclPropNames.includes(key)))
      excl = true;

    if (excl == false)
      obj[key] = null;
  }
}

// --------------------------------- object_split ---------------------------------
// split properties of input object into two output objects.
// properties that return true from splitFunc go into ouput object 1. Other 
// properties are moved to output object 2.
// splitFunc( prop, vlu )
function object_split( obj, splitFunc )
{
  const obj1 = {} ;
  const obj2 = {} ;
  for( const prop of Object.keys(obj))
  {
    const vlu = obj[prop] ;
    if ( splitFunc( prop, vlu ))
      obj1[prop] = vlu ;
    else
      obj2[prop] = vlu ;
  }
  return {obj1, obj2}
}

// -------------------------------- object_toArray --------------------------------
// copy properties of object to array, where each item in array is an object in 
// form { prop, vlu }
function object_toArray(obj)
{
  const arr = [];
  for (const prop of Object.keys(obj))
  {
    const vlu = obj[prop];
    arr.push({ prop, vlu });
  }
  return arr;
}

// ------------------------- object_toQueryString ---------------------------------
function object_toQueryString( obj )
{
  const qs = Object.keys(obj)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&');
  return qs ;
}

// ------------------
function objectProperty_AddTo( obj, propName, vlu )
{
  if ( propName in obj )
  {
    obj[propName] += Number(vlu) || 0 ;
  }
  else
  {
    obj[propName] = Number(vlu) || 0 ;
  }
}

// ---------------------- formatString_parse ------------------
// parse the formatNumeric string. return object with properties.
// sample formatMask: '2z,$'  or '0z,prefix|suffix'  '0b,$' - no zero suppress.
function formatString_parse(fmtMask)
{
  var numDec = 0;
  var zeroSup = false;
  var sepChar = '';
  var prefix = '';
  var suffix = '';

  var ix = 0;

  // first char. number of decimal places.
  if (ix < fmtMask.length)
  {
    var ch1 = fmtMask.substr(ix, 1);
    if ((ch1 >= '0') && (ch1 <= '9'))
    {
      ix += 1;
      numDec = Number(ch1);
    }
  }

  // next char. z if zero suppress.  b = no zero suppress.
  if (ix < fmtMask.length)
  {
    var ch1 = fmtMask.substr(ix, 1);
    if (ch1 == 'z')
    {
      ix += 1;
      zeroSup = true;
    }
    else if (ch1 == 'b')
    {
      ix += 1;
      zeroSup = false;
    }
  }

  // next char. digit separator.
  if (ix < fmtMask.length)
  {
    var ch1 = fmtMask.substr(ix, 1);
    if (ch1 != '|')
    {
      ix += 1;
      sepChar = ch1;
    }
  }

  // next is prefix string. prefix text ends with end of string or | char.
  if (ix < fmtMask.length)
  {
    var ch1 = fmtMask.substr(ix, 1);
    if (ch1 != '|')
    {
      var fx = fmtMask.indexOf("|", ix);
      var lx = fmtMask.length - ix;
      if (fx >= 0)
        lx = fx - ix;
      prefix = fmtMask.substr(ix, lx);
      ix += lx;
    }
  }

  // next is suffix string. suffix text follows | char to end of string.
  if (ix < fmtMask.length)
  {
    var ch1 = fmtMask.substr(ix, 1);
    if (ch1 == '|')
    {
      ix += 1;
      suffix = string_substrLenient(fmtMask, ix);
    }
  }
  return {
    numDec: numDec, zeroSup: zeroSup, sepChar: sepChar,
    prefix: prefix, suffix: suffix
  };
}

// ------------------------------ parentElem_hasFocus ------------------------------
// check if the DOM element or any of its child elements have input focus.
function parentElem_hasFocus(parentElem)
{
  const focusElem = document.activeElement;
  let hasFocus = (focusElem == parentElem);
  let ix = 0;
  while ((parentElem) && (hasFocus == false)
    && (ix < parentElem.children.length))
  {
    const elem = parentElem.children[ix];
    ix += 1;
    if (elem == focusElem)
    {
      hasFocus = true;
    }
    else if (elem.children.length > 0)
    {
      hasFocus = parentElem_hasFocus(elem);
    }
  }
  return hasFocus;
}

// ------------------------------ parentElem_focusInput ------------------------------
// set focus on first <input> element that is within the parentElem.
function parentElem_focusInput(parentElem)
{
  let found = false;
  let ix = 0;
  while (ix < parentElem.children.length)
  {
    const elem = parentElem.children[ix];
    ix += 1;
    if (elem.nodeName == 'INPUT')
    {
      elem.focus();
      found = true;
      break;
    }
    if (elem.children.length > 0)
    {
      found = parentElem_focusInput(elem);
      if (found)
        break;
    }
  }
  return found;
}

// ------------------------- path_combine --------------------------
// concat two path strings together
function path_combine(path1, path2, options)
{
  let combo = string_trim(path1);
  let sepChar = path_sepChar(combo, options ) ;

  const ch1 = string_tail(combo, 1);
  if (ch1 != sepChar)
    combo += sepChar;
  const s2 = string_trim(path2);
  if (string_head(s2, 1) != sepChar)
    combo += s2;
  else
    combo += s2.substr(1);
  return combo;
}

// ------------------------- path_getDirectory ------------------------
// return the directory part of the path.
function path_getDirectory(path, options)
{
  const sepChar = path_sepChar( path, options);
  const e = path.split( sepChar )         // break the string into an array
  e.pop()                     // remove its last element
  const dirPath = e.join( sepChar )              // join the array back into a string
  return dirPath;
}

// -------------------------- path_getExtension ------------------------
// return the extension part of a path name.
function path_getExtension(path)
{
  var ext = '';
  var fx = path.lastIndexOf('.');
  var bx = fx + 1;
  if ((bx > 0) && (bx < path.length))
  {
    ext = path.substr(bx);
  }
  return ext;
}

// ------------------------- path_getFileName ------------------------
// return the part of the path that follows the last "/" in the string.
function path_getFileName(path)
{
  var fileName = path;
  var fx = path.lastIndexOf('/');
  var bx = fx + 1;
  if ((bx > 0) && (bx < path.length))
  {
    fileName = path.substr(bx);
  }
  return fileName;
}

// --------------------------------- path_sepChar ---------------------------------
function path_sepChar( itemPath, options )
{
  let sepChar = '/';
  if (options && options.sepChar)
  {
    if (options.sepChar == '__calc')
    {
      const { found_char } = scan_charEqAny(itemPath, 0, '/\\');
      if (found_char)
      sepChar = found_char;
    }
    else
    {
      sepChar = options.sepChar;
    }
  }
  return sepChar ;
}

// -------------------------------- pdf_writeToIfs ------------------------------
// convert the pdf object to a blob.  Then upload the blob to the IFS. 
async function pdf_writeToIfs(pdf, toDirPath, fileName)
{
  let promise = new Promise(async (resolve, reject) =>
  {
    const toIfsPath = toDirPath + '/' + fileName;

    var blob = pdf.output('blob');
    var reader = new FileReader();
    reader.onload = (event) =>
    {
      // upload to the server as a blob.
      $.ajax(
        {
          url: "../../../site/php/php_writeToIfs.php",
          type: 'POST',
          data: {
            fileName, toIfsPath, data: event.target.result
          },
          dataType: 'text',
          success: function (data, status, xhr) 
          {
            resolve(toIfsPath);
          }
        });
    };
    reader.readAsDataURL(blob);
  });
  return promise;
}

// ----------------------- php_readFromIfs ----------------------------------
function php_readFromIfs(ifsDirPath, fileName, deleteFile = 'N')
{
  let ifsFilePath = ifsDirPath + '/' + fileName; 
  let promise = new Promise((resolve, reject) =>
  {
    var libl = 'couri7 aplusb1fcc';
    let fromIfsPath = encodeURIComponent(ifsDirPath);
    fromIfsPath = ifsFilePath;
    $.ajax({
      type: 'GET',
      url: "../php/php_readFromIfs.php",
      data: { fromIfsPath, fileName, deleteFile },
      cache: false,
      success: function (text)
      {
        resolve(text);
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        reject("Error... " + textStatus + "        " + errorThrown);
      },
      dataType: 'text'
    });
  });
  return promise;
}

// ------------------------------- php_writeToIfs -------------------------------
// general purpose way for the browser to write a stream of text data to the file
// system of the server.
async function php_writeToIfs(textData, toDirPath, fileName)
{
  let promise = new Promise((resolve, reject) =>
  {
    let toIfsPath = toDirPath + '/' + fileName;

    let blob = new Blob([textData], { type: 'application/json' });
    let reader = new FileReader();
    reader.onload = function (event)
    {
      // upload to the server as a blob.
      $.ajax(
        {
          url: "../../../site/php/php_writeToIfs.php",
          type: 'POST',
          data: { fileName, toIfsPath, data: event.target.result },
          dataType: 'text',
          success: function (data, status, xhr) 
          {
            resolve(data);
          }
        });
    };
    reader.readAsDataURL(blob);
  });
  return promise;
}

// ----------------------------- promise_runArray ----------------------------------
// when called, each function in funcArray returns a promise.  promise_runArray 
// recursively runs each promise.  When last promise completes, return promise.
function promise_runArray( funcArray, ix )
{
  ix = ix || 0 ;
  let promise = new Promise((resolve,reject) =>
  {
    if ( ix >= funcArray.length )
      resolve( ) ;
    else
    {
      let func = funcArray[ix] ;
      let p1 = func( ) ;
      p1.then(() =>
      {
        let p2 = promise_runArray( funcArray, ix + 1 ) ;
        p2.then( () =>
        {
          resolve( ) ;
        });
      });
    }
  });
  return promise ;
}

// ----------------------- queryString_getItem ---------------  
function queryString_getItem( itemName, defaultValue = null )                        
{                                                               
  var searchString = window.location.search.substring(1) ;      
  var params = searchString.split("&");                         
                                                                
  for( var ix = 0; ix < params.length; ix++)                    
  {                                                             
    var val = params[ix].split("=");
    if ( decodeURIComponent(val[0]) == itemName)                                     
    {                                                           
      return decodeURIComponent(val[1]);                                            
    }                                                           
  }                                                             
  return defaultValue ;                                                  
}

// --------------------------- scan_charEqAny ------------------------------
// scan in string until char equal any of pattern chars.
function scan_charEqAny(text, bx, pattern )
{
  let ix = bx;
  let found_char = '';
  let found_index = -1;
  while (ix < text.length)
  {
    const ch1 = text.substr(ix, 1);
    const fx = pattern.indexOf(ch1);
    if (fx >= 0)
    {
      found_index = ix;
      found_char = ch1;
      break;
    }
    ix += 1;
  }
  return { found_index, found_char };
}

// --------------------------- scan_charNeAll ------------------------------
// scan in string until char not equal any of pattern chars.
function scan_charNeAll( text, bx, pattern )
{
  let ix = bx ;
  while( ix < text.length )
  {
    const ch1 = text.substr(ix,1) ;
    const fx = pattern.indexOf(ch1 ) ;
    if ( fx == -1 )
      break ;
    ix += 1 ;
  }
  if ( ix < text.length )
    return ix ;
  else 
    return -1 ;
}

// ----------------------------- scan_revCharEqAny --------------------------------
// scan backwards until character is equal any of chars in anyChar string.
// ( look in reverse until whitespace char is found. )
function scan_revCharEqAny( text, bx, anyChar )
{
  let ix = bx;
  while (ix >= 0)
  {
    const ch1 = text.substr(ix, 1);
    const fx = anyChar.indexOf(ch1);
    if (fx >= 0)
      break;
    ix -= 1;
  }
  if (ix >= 0)
    return ix;
  else
    return -1;
}

// ---------------------- string_compare ------------------------------
// compare two strings and array.sort purposes.
function string_compare(a, b)
{
  if ((!a) && (!b))
    return 0;
  else if (!a)
    return -1;
  else if (!b)
    return 1;
  else if (a < b)
    return -1;
  else if (a == b)
    return 0;
  else
    return 1;
}

// ------------------------------ string_compareRltn ------------------------------
// compare two string for the specified relation.
// rltn: lt, gt, eq, le, ge, ...
function string_compareRltn( a, rltn, b )
{
  if ( rltn == 'eq')
    return ( a == b)
  else if (rltn == 'ne')
    return (a != b);
  else if ( rltn == 'lt')
    return ( a < b )
  else if ( rltn == 'gt')
    return ( a > b);
  else if (rltn == 'le')
    return (a <= b);
  else if (rltn == 'ge')
    return (a >= b);
  else if ( rltn == 'ctn')
  {
    const fx = a.indexOf(b) ;
    return ( fx >= 0 ) ;
  }
  else
    return false ;
}

// --------------------------------- string_cycle ---------------------------------
// find vlu in array of values. return the next value in that array.
// string_cycle( 'show', ['show','hide']) will return 'hide'. then next call will
// return 'show'.
function string_cycle(vlu, values)
{
  const fx = values.indexOf(vlu);
  if (fx == -1)
    return vlu;
  else
  {
    let nx = fx + 1;
    if (nx >= values.length)
      nx = 0;
    return values[nx];
  }
}

// ---------------------------- string_dataDefn ----------------------------------
// determine the data defn of the input value.
function string_dataDefn(vlu)
{
  let dtyp = '';
  let lgth = vlu ? vlu.length : 0 ;
  let whole = 0;
  let prec = 0;

  if ( !vlu )
  {
  }
  else if ( isNaN(vlu) == true)
  {
    dtyp = 'char';
  }
  else
  {
    const numText = vlu.replace(/[+-,$]/g, '');
    dtyp = 'decimal';
    const fx = numText.indexOf('.');
    if (fx >= 0)
    {
      const parts = numText.split('.');
      whole = parts[0].length;
      prec = parts[1].length;
    }
    else
    {
      whole = numText.length;
    }
    lgth = whole + prec ;
  }
  return { vlu, dtyp, lgth, whole, prec };
}

// ----------------------- string_dequote ------------------------
// note: the quote char can be any character. The rule is the first char is the
//       quote char. Then the closing quote is that same first char. And the
//       backslash is used to escape the quote char within the string.
// Use string_isQuoted
function string_dequote( text )
{
  var dequoteText = '' ;
  var quoteChar = text[0] ;
  var ix = 1 ;
  var lastIx = text.length - 2 ;
  while( ix <= lastIx )
  {
    const ch1 = text[ix];
    const nx1 = (ix == lastIx) ? '' : text[ix + 1];
    if ((ch1 == '\\') && (nx1 == quoteChar))
    {
      ix += 2;
      dequoteText += quoteChar;
    }
    else if ((ch1 == '\\') && (nx1 == '\\'))
    {
      ix += 2;
      dequoteText += ch1;
    }
    else
    {
      dequoteText += ch1;
      ix += 1;
    }
  }
  return dequoteText ;
}

// ----------------------- string_dequote_meta ------------------------
function string_dequote_meta(text, startIx = 0)
{
  let dequoteText = '';
  const quoteChar = text[startIx];
  let ix = startIx + 1;
  let endIx = -1 ;
  let errmsg = null ;
  while (ix < text.length)
  {
    const ch1 = text[ix] ;

    // escape char.
    if (ch1 == '\\')
    {
      dequoteText += text[ix + 1];
      ix += 2;
    }
    else if ( ch1 == quoteChar )
    {
      endIx = ix;
      break ;
    }
    else
    {
      dequoteText += ch1;
      ix += 1;
    }
  }

  // end of quoted string not found.
  if ( endIx == -1 )
  {
    errmsg = `close quote not found. Quoted text starts at pos ${startIx}`;
  }

  return {dequoteText, endIx, errmsg} ;
}

// ----------------------- string_Enquote --------------
// quoteEscape. How to escape the double quote character.  
// & - replace '"' with &quot;    \ - replace with \"
function string_Enquote( text, kwd = '', quoteChar = '"', ignoreEmpty = true, quoteEscape = '&' )
{
  var quotedText = '' ;

  // calc the quotechar to use. ( based on if string contains '"' or "'" )
  if (( quoteChar.length == 5 ) && ( quoteChar == "*calc"))
  {
    if ( text.indexOf('"') >= 0 )
      quoteChar = "'" ;
    else
      quoteChar = '"' ;
  }

  if  (( text.length > 0 ) || ( ignoreEmpty == false ))
  {

  if ( kwd )
  {
    quotedText += ' ' + kwd + '=' ;
  }

  // replace all quotes and new lines in the text.
  if (( quoteChar == '"' ) && ( quoteEscape == '&'))
  {
    text = text.replace(/["]/g,'&quot;') ;
    text = text.replace(/[\n]/g,'&#10;') ;
  }
  else
  {
    text = text.replace(/\\/g, '\\\\') ;   // double up the backslash characters.
    text = text.replace(/"/g,'\\"') ;      // backslash escape all double quotes.
  }

  quotedText += quoteChar + $.trim(text) + quoteChar ;
  }

  return  quotedText ;
}

// ------------------------- string_formatNumBytes -----------------------
// format a numeric value that contains a number of bytes. 
function string_formatNumBytes( vlu, bytes_suffix )
{
  let numText = '' ;
  if ( vlu >= 1000000000 )
  {
    vlu = vlu / 1000000000 ;
    numText = string_formatNumeric( vlu, '2z,|GB') ;
  }
  else if (vlu >= 1000000)
  {
    vlu = vlu / 1000000;
    numText = string_formatNumeric(vlu, '2z,|MB');
  }
  else if (vlu >= 1000)
  {
    vlu = vlu / 1000;
    numText = string_formatNumeric(vlu, '2z,|KB');
  }
  else
  {
    numText = string_formatNumeric(vlu, '0z,');
    if ( bytes_suffix )
      numText += bytes_suffix ;
  }
  return numText ;
}

// --------------------- string_formatNumeric ----------------------
// format numeric value into string. add comma, decimal place,
// zero suppress, add prefix and suffix.
// sample formatMask: '2z,$'  or '0z,prefix|suffix'
function string_formatNumeric( inValue, fmtMask )
{
  var s1 = $.trim(inValue) ;
  var num = Number(s1) ;
  var cv  = formatString_parse( fmtMask ) ;
  var numText = '' ;

  // blanks if zero.
  if  (( num == 0 ) && ( cv.zeroSup == true ))
    numText = '' ;

  // edit the number value.
  else
  {
    numText = cv.prefix + num.format( cv.numDec ) + cv.suffix ;
  }

  return  numText ;
}

// -------------------------- string_head ----------------------
// return the front of the string
function string_head( text, lx )
{
  if ( !text )
    return '' ;
  if ( lx > text.length )
    lx = text.length ;
  if ( lx <= 0)
    return '' ;
  else
    return text.substr(0,lx) ;
}

// ----------------------- string_indexOfUnescapedChar ------------------------
// find char in string that is not escaped ( preceded with escape char ) 
function string_indexOfUnescapedChar(text, findChar, bx )
{
  let ix = bx || 0 ;  // start of search.
  let foundIx = -1 ;  // find result. init to not found.
  while (ix < text.length)
  {
    const ch1 = text[ix];

    // current char escapes the next char. advance past next char. 
    if (ch1 == '\\')  
    {
      ix += 2;
    }

    // character being searched for. return its index.
    else if ( ch1 == findChar )
    {
      foundIx = ix ;
      break ;
    }

    // advance index. continue search.
    else
    {
      ix += 1 ;
    }
  }
  return foundIx;
}

// ------------------------ string_insert ---------------------
function string_insert( text, ox, insertText )
{
  let part1 = text.substring(0,ox) ;
  let part2 ;
  if ( ox < text.length )
    part2 = text.substring(ox) ;
  else
    part2 = '' ;
  return part1 + insertText + part2 ;
}

// ----------------------------- string_isDigits -----------------------------------
function string_isDigits( text )
{
  const pattern = /^\d+$/;
  return pattern.test(text);  // returns a boolean  
}

// ------------------------------- string_isQuoted --------------------------------
function string_isQuoted( text, quoteChar )
{
  let isQuoted = false ;
  if ( text.length >= 2 )
  {
    const headChar = string_head(text, 1) ;

    // continue with test.  checking if is specified quote char.
    if ( !quoteChar || (headChar == quoteChar ))
    {
      if (( headChar == '"') || ( headChar == "'") || ( headChar == '`') ||
        ( headChar == '/'))
      {
        const tailCh1 = string_tail(text, 1) ;
        const tailCh2 = string_tail(text, 2) ;
        if (( headChar == tailCh1 ) && ( tailCh2.substr(0,1) != '\\' ))
          isQuoted = true ;
      }
    }
  }
  return isQuoted ;
}

// ----------------------- string_padLeft -----------------------
// pad on the left until specified length.
function string_padLeft(inText, length, padChar)
{
  padChar = padChar || ' ';
  let text = String(inText);
  while (text.length < length)
  {
    text = padChar + text;
  }
  return text;
}

// ------------------------- string_padRight ----------------------------
// pad on the right with pad character.
function string_padRight( inText, padLx, padChar )
{
  padChar = padChar || ' ' ;
  text = String(inText) ;
  while( text.length < padLx )
  {
    text += padChar ;
  }
  return text ;
}

// ------------------- string_quoteEncode -------------------------
// replace all '"' with "&*@"
function string_quoteEncode(text)
{
  var s1 = text.replace(/["]/g, "&*@");   // replace all " with #*;
  return s1;
}

// ------------------- string_quoteDecode -------------------------
// replace all "&*@" in the string with '"'
function string_quoteDecode(text)
{
  var s1 = text.replace(/&\*@/g, '"');   // replace all &*@ with "
  return s1;
}

// -------------------- string_replaceAll -----------------------
// replace all occurance of findText with replaceText
function string_replaceAll(str, findText, replaceText)
{
  let res = '';
  let ix = 0;
  while (ix < str.length)
  {
    const fx = str.indexOf(findText, ix);

    // length from start to found position
    let lx = 0;
    if (fx == -1)
      lx = str.length - ix;
    else
      lx = fx - ix;

    // copy not match text to result.
    if (lx > 0)
      res += str.substr(ix, lx);

    // match found. add replacement text to result.
    if (fx != -1)
      res += replaceText;

    // advance in str.
    if (fx == -1)
      ix = str.length;
    else
      ix = fx + findText.length;
  }
  return res;
}

// --------------------- string_replaceAt -----------------
// replace substr in string at the specified location.
function string_replaceAt(text, bx, lx, rplText)
{
  let beforeText;
  let afterText = '';

  // setup before replacement text. 
  {
    if (bx > text.length)
      beforeText = text;
    else if (bx == 0)
      beforeText = '';
    else
      beforeText = text.substr(0, bx);

    // begin pos exceeds length of string. Pad the before text.
    const padLx = bx - text.length;
    if (padLx > 0)
      beforeText = string_padRight(beforeText, padLx);
  }

  // text that comes after the text being replaced.
  const nx = bx + lx;
  if (nx < text.length)
    afterText = text.substr(nx);

  return beforeText + rplText + afterText;
}

// ------------------------- string_splitIndex ----------------------
// split string into two parts. Split at the location of the index.
function string_splitIndex(text, index)
{
  let part1, part2;

  // everything before the index is part 1
  part1 = text.substr(0, index);

  // part2 runs from index to end.
  if (index < text.length)
    part2 = text.substr(index);
  else
    part2 = '';

  return { part1, part2 };
}

// ---------------------------- string_substrLenient --------------------
// return substring of the input string. only, clip the results if start or end
// pos are out of bounds of the string.
function string_substrLenient(str, fx, lx = -1)
{
  if ((typeof str) != 'string')
    return '';

  // move from from negative to zero. Reduce length by the adjusted amount.
  if (fx < 0)
  {
    var adj = 0 - fx;
    fx += adj;
    if (lx != -1)
    {
      lx -= adj;
      if (lx < 0)
        lx = 0;
    }
  }

  if (fx >= str.length)
    return '';
  if (lx == -1)
    return str.substr(fx);

  // remaining length.
  var remLx = str.length - fx;

  // trim length if remaining lgth exceeded.
  if (lx > remLx)
    lx = remLx;

  return str.substr(fx, lx);
}

// ----------------------- string_sentenceAppend ---------------------------
// append to end of string as if adding to a sentence.
// append to end of string.  if string has text concat a blank and then the text.
// sepText : separator text. default is ' '.  Use ', ' to separate by comma.
function string_sentenceAppend( text, appendText, sepText = ' ' )
{
  if ( !text )
    return appendText ;
  else if ( !appendText )
    return text ;
  else
    return text + sepText + appendText ;
}

// ---------------------------- string_substrLenient --------------------
// return substring of the input string. only, clip the results if start or end
// pos are out of bounds of the string.
function string_substrLenient( str, fx, lx = -1 )
{
  if (( typeof str) != 'string' )
    return '' ;

  // move from from negative to zero. Reduce length by the adjusted amount.
  if ( fx < 0 )
  {
    var adj = 0 - fx ;
    fx += adj ;
    if ( lx != -1 )
    {
      lx -= adj ;
      if ( lx < 0 )
        lx = 0 ;
    }
  }

  if ( fx >= str.length )
    return '' ;
  if ( lx == -1 )
    return str.substr(fx) ;

  // remaining length.
  var remLx = str.length - fx ;

  // trim length if remaining lgth exceeded.
  if ( lx > remLx )
    lx = remLx ;

  return str.substr(fx,lx) ;
}

// ----------------------string_tail ---------------------------------
// options: { padLeft:true, padRight:true }
function string_tail( text, lx, options )
{
  if ( text.length <= lx )
  {
    options = options || {} ;
    if ( options.padLeft )
      return string_padLeft(text, lx ) ;
    else if ( options.padRight )
      return string_padRight( text, lx ) ;
    else 
      return text ;
  }
  else
  {
    const bx = text.length - lx ;
    return text.substr(bx) ;
  }
}

// ---------------------------- string_tailSplit -------------------------
// split string into two parts. the remainder and the tail.
function string_tailSplit( text, lx )
{
  const part1_lx = Math.max(text.length - lx, 0) ;
  const part2_lx = Math.min( lx, text.length ) ;
  const part1 = text.substr(0, part1_lx) ;
  const part2 = text.substr(part1_lx, part2_lx) ;
  return [part1, part2] ;
}

// ------------------------ string_toHex ----------------------------
function string_toHex( text )
{
  var hex = '';
  for (var ix = 0; ix < text.length; ix++) 
  {
    let hexChar = text.charCodeAt(ix).toString(16);
    if ( hexChar.length == 1 )
      hexChar = '0' + hexChar ;
    if ( hex.length > 0 )
      hex += ' ' ;
    hex += hexChar ;
  }
  return hex;                                   
}

// ------------------------- string_trim --------------------
function string_trim(str)
{
  if (typeof str == 'number')
    str = str.toString();
  if (!str)
    return str ;
  else
  {
    let s1 = str.replace(/(\s+$)|(^\s+)/g, "");
    return s1;
  }
}

// ------------------------- string_TrimBlanks --------------------
function string_TrimBlanks(str)
{
  if ( !str)
    return '' ;
  else
  {
    var s1 = str.replace(/(\s+$)|(^\s+)/g, "") ; 
    return s1 ;
  }
}

// ------------------------- string_rtrim --------------------
function string_rtrim(str)
{
  if (!str)
    return '' ;
  else
    return str.replace(/\s+$/, "");
}

// ------------------------------ string_splitStyleText --------------------------------
// split the style="border:1px solid black;width:300pt;padding:5pt;"
// the split text passed to this function is the text within the double quotes.
// split on the semicolon.  Then return array containing object {name, vlu}
function string_splitStyleText(text)
{
  let splitArray = [] ;
  if ( text )
  {
    let semiArray = text.split(';') ;
    semiArray.forEach((item) =>
    {
      let arr = item.split(':') ;
      if ( Array.isArray(arr))
      {
        let [name,vlu] = arr ;
        splitArray.push({name, vlu}) ;
      }
    });
  }
  return splitArray ;
}

// ----------------------- string_unescape ------------------------
// remove all the backslash characters from the string. With the exception of when
// the backslash is followed by another backslash. In that case, remove only the
// first of the pair.
function string_unescape(text)
{
  let ix = 0;
  let result = '';
  while (ix < text.length)
  {
    const ch1 = text[ix];
    const nx1 = (ix + 1 >= text.length) ? '' : text[ix + 1];
    if ((ch1 == '\\') && (nx1 == '\\'))
    {
      result += ch1 ;
      ix += 2;
    }
    else if ( ch1 == '\\')
    {
      ix += 2 ;
      result += nx1 ;
    }
    else
    {
      ix += 1 ;
      result += ch1 ;
    }
  }
  return result;
}

// ------------------------------- timeoutTimer_clear -----------------------------
// cb ( controlBlock ) {timerId}
function timeoutTimer_clear( cb )
{
  if (( cb ) && ( cb.timerId ))
  {
    window.clearTimeout( cb.timerId ) ;
    cb.timerId = null ;
  }
  return null ;
}

// -------------------------------- timeoutTimer_set ------------------------------
function timeoutTimer_set( msec, handler )
{
  const timerId = window.setTimeout(handler, msec ) ;
  return {timerId} ;
}

// ----------------------------- window_download ----------------------------
function window_download( textStream, fileName )
{
  const textFileAsBlob = new Blob([textStream], { type: 'text/plain' });
  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.innerHTML = "Download File";
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.click();
}

// ------------------------- window_timeout ------------------------------
// one time window.timeout.  Runs as a promise.  to use:
//   await window_timeout(2000) ;   // wait 2 seconds
function window_timeout(mseconds)
{
  const promise = new Promise((resolve, reject) =>
  {
    window.setTimeout(() =>
    {
      resolve();
    }, mseconds);
  });
  return promise;
}
