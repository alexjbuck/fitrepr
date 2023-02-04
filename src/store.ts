import { writable } from 'svelte/store'

export interface Accomplishment {
    description: string;
    date: string;
    id?:number;
    user_id:string;
}

export let accomplishments = writable<Array<Accomplishment>>([])