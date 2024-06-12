import axios from "axios";
import {Command} from 'commander';
import {type LuaDef,type  OuterDefinition,type Definition } from "./utils";

const fetchDefs = async (wd:string, desiredValue:string):Promise<LuaDef> => {
	let response = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + wd)
		.then((data)=>{return data.data[0].meanings})
		.catch((err)=>console.log("No definitions found for " + wd, err));
	let defs:string[] = [];
	response.forEach((def:OuterDefinition) => {
		if(desiredValue == 'syn'){
			def.synonyms.forEach((s:string)=>{defs.push(s)});
		} else {
			def.definitions.forEach((d:Definition) => {
				defs.push(d.definition);
			});
		}
	});
	const luaObj:LuaDef = {
		word:wd,
		definitions:defs
	}
	return luaObj;
}

const constructLuaOutput = (obj:LuaDef):string => {
	let s:string = '{';
	s += 'word = "' + obj.word + '", definitions = {';
	for(let def of obj.definitions){
		s += '"' + def + '",';
	}
	return s + '}}';
}

const program:Command = new Command();

program.name('dictionary-api-call')
	.description(`A CLI program for calling either the synonym or definition to render in NeoVim
							 |Options| -s --syn (synonyms) -d --def (definitions)
									Example: cli.ts -s 'serendipity'`)
	.option('-d, --def <word>')
	.option('-s, --syn <word>')
	.parse(process.argv)

async function main(){
	const options = program.opts();
	const word = options.syn || options.def;
	if(!word){
		console.error('Please enter a word');
		program.help();
	}	
	const syn:LuaDef|null = options.syn ? await fetchDefs(word,'syn') : null;
	const def:LuaDef|null = options.def ? await fetchDefs(word,'def') : null;

	if(syn){
		console.log(constructLuaOutput(syn));
	} else if(def){
		console.log(constructLuaOutput(def));
	} else {
		console.log('No definitions or synonyms found');
	}
}

//main();

async function printF(){
	const data = await fetchDefs('serendipity','syn')
	console.log(data);
}

printF();
