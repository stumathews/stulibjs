function loadXMLDoc(filename)
{
  if (window.ActiveXObject)
  {
    xhttp = new ActiveXObject("Msxml2.XMLHTTP");
  }
  else 
  {
    xhttp = new XMLHttpRequest();
  }
  
  xhttp.open("GET", filename, false);

  try
  {
    xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
    xhttp.send("");
    return xhttp.responseXML;
  }

  function displayResult()
  {
    xml = loadXMLDoc("cdcatalog.xml");
    xsl = loadXMLDoc("cdcatalog.xsl");
    
    if (window.ActiveXObject || xhttp.responseType == "msxml-document") // code for IE
    {
      ex = xml.transformNode(xsl);
      document.getElementById("example").innerHTML = ex;
    }    
    else if (document.implementation && document.implementation.createDocument) // code for Chrome, Firefox, Opera, etc.
    {
      xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl);
      resultDocument = xsltProcessor.transformToFragment(xml, document);
      document.getElementById("example").appendChild(resultDocument);
    }
 }