export type Definition = {
	definition:string;
	synonyms:string[];
	antonyms:string[];
	example:string;
}

export type OuterDefinition = {
	partOfSpeech:string;
	definitions:Definition[];
	synonyms:string[];
	antonyms:string[];
}

export type LuaDef = {
	word:string;
	definitions:string[];
}

