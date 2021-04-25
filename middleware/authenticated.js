export default function({store,redirect}){
    // console.log(!store.state.auth);
    if(!store.state.user){
        return redirect('/login')
    }
}