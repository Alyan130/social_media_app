
function page({params}:{params:{name:string}}) {

const username = params.name

  return (
  <>
  <h1>{username}</h1>
  </>
    )
}

export default page