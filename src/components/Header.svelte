<script>
	import { AppBar, LightSwitch, menu } from "@skeletonlabs/skeleton";
	import Account from "./Account.svelte";

</script>

<AppBar>
    <svelte:fragment slot="lead">
        <a class='hover:text-primary-500 transition-all duration-300' href="/">
            <h1>Fitrepr</h1>
        </a>
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <LightSwitch />
        <Account />
    </svelte:fragment>
    
</AppBar>