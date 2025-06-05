export default function StartProcess(){

    const start = () => {
        console.log("starting JAR");
    }
    return (
        <div>
            <button onClick={start}>Start Process</button>
        </div>
    )
}