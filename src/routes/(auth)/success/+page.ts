/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  const username = url.searchParams.get('username') || '';
  
  return {
    username,
    redirectTo: '/onboarding?username=' + username,
  };
}