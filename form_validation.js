
/**************************
* Author: Stuart Mathews
* Description: Various javascript functions to aid form validation.
* Date: Sunday 15/12/2013
***************************/


/****************************************************************************
* Name: isEmpty(field_id)
* Description:  Checks to see if the provided field has an empy ot null value
* Returns :  true if element's value is null or empty.
*******************************************************************************/

function isEmpty(field_id)
{
	
	var field = document.getElementById(field_id);
	var field_text = field.value;
	var result = false;

	if( field_text == null || field_text == "" )
		return true;
	if( field.value.length < 1 )
		return true;

	return result;
	
}


/****************************************************************************
* Name: attachErrorToField( strErrorMsg, field_id )
* Description:  Adds an error field to the field. 
* field needs to be wraqpped in a <div class="name"> tag where is the id of the
* validation field used
* Returns : nothing
*******************************************************************************/
function attachErrorToField( strErrorMsg, field_id, field_wrapper_id )
{
	var field = document.getElementById(field_id);
	var textNode = document.createTextNode(strErrorMsg);
	
	var parentElement = field.parentElement;
	
	if( parentElement.id == field_wrapper_id )
	{
		parentElement.appendChild( textNode );
	}
}

/**
* Name: hasOnlyDigits( field_id)
* Description: Checks to see if the input represented by field_id 
* has a value which is only digits.
* Returns: true of the value is a digit onlny vlaue, false otherwise.
*/
function hasOnlyDigits( field_id )
{

    var field = document.getElementById(field_id);    
    var regex = '^[123456789]\\d*$';
    var results = field.value.match(regex);

    if (results == null)
        return false;
    if (results.length > 0)
        return true;    
}

/*
* Name: didThisRegexMatchOnFieldValue( regex, field_id)
*/
function didThisRegexMatchOnFieldValue( regex, field_id)
{
    var field = document.getElementById(field_id);        
    var results = field.value.match(regex);

    if (results == null)
        return false;
    if (results.length > 0)
        return true;    
}

function numberWithinLimits( field_id, min,max)
{
	
	var number_field = document.getElementById(field_id);
	var number_value = number_field.value;
	
	if( !hasOnlyDigits(field_id))
		console.log("Field is not a number");
	if( number_value > min && number_value < max )
		return true;
	else
		return false;

}

/**
* Name: removeValidationMessages( field_id, field_wrapper_id )
* Description: Removes all #text child elements in the parent element,
* which should have the id of field_wrapper_id
* of the provided element(represented by the field_id param)
* Returns: nothing
*/
function removeValidationMessages(field_id, field_wrapper_id)
{
	/* Obtain the element we're looking to validate */
	var field = document.getElementById(field_id);	
	if( field == null){
		console.log("Problem finding element within removeValidationMessages() ");
		return;
	}

	
	var parentElement = field.parentElement;

	if( parentElement.id != field_wrapper_id){
		console.log("cannot field validation field div");
		return;
	}

	for( i = 0; i < parentElement.childNodes.length ;i++ )
	{
		var lastChild = parentElement.lastChild;

		if( lastChild.nodeName == "#text")
		{
    		parentElement.removeChild(lastChild);
		}
	}
}

/**
* Name: isSelection
* Description: Checks to see if the current value of form field, field_id is value.
* Returns: true, if the field(represented by field_id) has the value, value
*/
function isSelection( field_id, value )
{
	var field = document.getElementById( field_id );	
	if( field.value == value )
		return true;
	else
		return false;
}

/**
* Name: validateFieldsIsEmptyOrDefault( field_ids)
* Description: With a list of field_ids, these fields are validated to be empty or default.
* a 'default' field is a field which has 'default' as its value.
* Note: Suitable messages are appended next to each field which is either empty or has default value
* Returns: true if validation problems found, false otherwise
*/
function validateFieldsIsEmptyOrDefault( field_ids, field_wrapper_id)
{
	var validation_problems_found = false;
	var error = "";
	var counter = 0;
	while( counter <= field_ids.length-1 )
	{
		var field_id = field_ids[counter]; // current field being looked at
		removeValidationMessages(field_id,field_wrapper_id);
		
		if( isEmpty(field_id) )
		{	
		  error = "Field cannot be empty";
		  attachErrorToField( error, field_id, field_wrapper_id );
		  validation_problems_found = true;
		}

		if( isSelection( field_id, 'default'))
		{
			error = "Please make a selection";
			attachErrorToField( error, field_id, field_wrapper_id );
			validation_problems_found = true;
		}
		counter = counter + 1;
	}
	return validation_problems_found;
}

/*
* Checks to see if the expected number_type_fields are indeed numbers and that they are valid.
* Returns true is validation erros were found.
*/
function validateNumberFields(number_type_fields, field_wrapper_id)
{
	var validation_problems_found = false;
	for( var field_count = 0 ; field_count < number_type_fields.length; field_count++)
	{
		field_id = number_type_fields[field_count];
		removeValidationMessages(field_id,field_wrapper_id);
		
		if(!hasOnlyDigits(field_id))
		{
 	   		attachErrorToField( 'Invalid number format, use 1-9999', field_id, field_wrapper_id );
 	   		validation_problems_found = true;
		}
		else
		{

			// Further ensure that the digits are valid
			var min = 0;
			var max = 99999;
			if( !numberWithinLimits( field_id, min, max))
			{
				var message = "Value must be between " + min + " and " + max;
				attachErrorToField( message, field_id, field_wrapper_id );
 	   			validation_problems_found = true;
			}
		}		
	}
	return validation_problems_found;
}

function validateDateFormatFields(date_type_fields, field_wrapper_id)
{
	var validation_problems_found = false;
	for( var field_count = 0 ; field_count < date_type_fields.length; field_count++)
	{
		field_id = date_type_fields[field_count];
		removeValidationMessages(field_id,field_wrapper_id);
		
		// format regex validator: it looks for well formed dates, not correct ones!
		var find_valid_date_format_regex = "\\d{4}-\\d{2}-\\d{2}";

		if( !didThisRegexMatchOnFieldValue(find_valid_date_format_regex, field_id )) // note field_id not field_value!
		{
			var message = "Invalid date format, use YYYY-MM-DD";
			attachErrorToField( message, field_id, field_wrapper_id );
   			validation_problems_found = true;
		}
	}
	return validation_problems_found;
}

function validateTimeFormatFields( time_type_fields, field_wrapper_id)
{
	var validation_problems_found = false;
	for( var field_count = 0 ; field_count < time_type_fields.length; field_count++)
	{
		field_id = time_type_fields[field_count];
		removeValidationMessages(field_id,field_wrapper_id);
		
		// format regex validator: it looks for well formed dates, not correct ones!
		var find_valid_time_format_regex = "\\d{2}:\\d{2}:\\d{2}";

		if( !didThisRegexMatchOnFieldValue(find_valid_time_format_regex, field_id )) // note field_id not field_value!
		{
			var message = "Invalid time format, use HH:MM:SS";
			attachErrorToField( message, field_id, field_wrapper_id );
   			validation_problems_found = true;
		}
	}
	return validation_problems_found;
}

function validatePBField( pb_type_fields, field_wrapper_id)
{
	var validation_problems_found = false;
	for( var field_count = 0 ; field_count < pb_type_fields.length; field_count++)
	{

		field_id = pb_type_fields[field_count];
		removeValidationMessages(field_id,field_wrapper_id);
		
		// format regex validator: it looks for well formed dates, not correct ones!
		var find_valid_time_format_regex = "^[01]*$";

		if( !didThisRegexMatchOnFieldValue(find_valid_time_format_regex, field_id )) // note field_id not field_value!
		{
			var message = "Invalid PB indicator format, use 0 for false or 1 for true ";
			attachErrorToField( message, field_id, field_wrapper_id );
   			validation_problems_found = true;
		}		
	}
	return validation_problems_found;

}

function validatePercentageFields( percentage_type_fields, field_wrapper_id)
{
	var validation_problems_found = false;
	for( var field_count = 0 ; field_count < percentage_type_fields.length; field_count++)
	{

		field_id = percentage_type_fields[field_count];
		removeValidationMessages(field_id,field_wrapper_id);
		
		// format regex validator: it looks for well formed dates, not correct ones!
		var find_valid_time_format_regex = "^\\d*[.]*\\d+$";

		if( !didThisRegexMatchOnFieldValue(find_valid_time_format_regex, field_id )) // note field_id not field_value!
		{
			var message = "Invalid percentage number format.";
			attachErrorToField( message, field_id, field_wrapper_id );
   			validation_problems_found = true;
		}		
	}
	return validation_problems_found;

}

function validateCategoryIdFields( categoryId_type_fields, field_wrapper_id)
{
	var validation_problems_found = false;
	for( var field_count = 0 ; field_count < categoryId_type_fields.length; field_count++)
	{

		field_id = categoryId_type_fields[field_count];
		removeValidationMessages(field_id,field_wrapper_id);
		
		
		var min = 0;
		var max = 100;
		if( !numberWithinLimits(field_id, min, max)) // note field_id not field_value!
		{
			var message = "Invalid category Id. value must be "+min+ "-"+max;
			attachErrorToField( message, field_id, field_wrapper_id );
   			validation_problems_found = true;
		}		
	}
	return validation_problems_found;

}