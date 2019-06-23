import Link from 'next/link';

const Index = () => {
    return (
        <div>
            <h1>OnePass Web</h1>
            <p>
                Designed with Next.js!
                <Link href="/about">
                    <a>About</a>
                </Link>
            </p>
        </div>
    );
}

export default Index;
