<script lang="ts">
    let { 
        data, 
        headerClass, 
        bodyClass 
    }: { 
        data: Record<string, string[]>, 
        headerClass: string, 
        bodyClass: string 
    } = $props();
</script>

<table>
    <thead class={headerClass}>
        <tr>
            {#each Object.keys(data) as columnName}
                <th>{columnName}</th>
            {/each}
        </tr>
    </thead>
    <tbody class={bodyClass}>
        {#each Object.values(data) as row}
            <tr>
                {#each row as cell}
                    <td>{cell}</td>
                {/each}
            </tr>
        {/each}
</table>