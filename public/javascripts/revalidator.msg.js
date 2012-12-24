/*
 * 特定のviewに依存しないバリデーションエラーのメッセージリソース
 *  * %{}はrevalidator内で置換される。
 *  {{label}}部分はメッセージ表示時にラベルが埋め込まれる。
 */

window.json.validate.messages = {
    required:"{{label}} is required",
    minLength:"{{label}} is too short (minimum is %{expected} characters)",
    maxLength:"{{label}} is too long (maximum is %{expected} characters)",
    pattern:"{{label}} invalid input",
    minimum:"{{label}} must be greater than or equal to %{expected}",
    maximum:"{{label}} must be less than or equal to %{expected}",
    exclusiveMinimum:"{{label}} must be greater than %{expected}",
    exclusiveMaximum:"{{label}} must be less than %{expected}",
    divisibleBy:"{{label}} must be divisible by %{expected}",
    minItems:"{{label}} must contain more than %{expected} items",
    maxItems:"{{label}} must contain less than %{expected} items",
    uniqueItems:"{{label}} must hold a unique set of values",
    format:"{{label}} is not a valid %{expected}",
    conform:"{{label}} must conform to given constraint",
    type:"{{label}} must be of %{expected} type"
};