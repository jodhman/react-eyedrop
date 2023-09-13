const GradientBg = () => {
    return <div style={{color: 'white'}}>
            <div>SVG element</div>
            <div
                style={{
                    width: 200,
                    height: 100,
                    backgroundImage: 'linear-gradient(to right bottom, #0038ff, #714afc, #9e61fb, #be7afa, #d895fb, #c6adff, #bdc1ff, #c0d2ff, #aadeff, #97eaff, #91f4fa, #9efbe8)'   
                }}
            />
        </div>
}

export default GradientBg;
