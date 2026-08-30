export default function Background() {
    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(110,91,255,0.14),transparent_30%),radial-gradient(circle_at_82%_30%,rgba(0,229,255,0.10),transparent_28%),radial-gradient(circle_at_48%_86%,rgba(255,122,24,0.09),transparent_32%),radial-gradient(circle_at_78%_78%,rgba(255,79,216,0.07),transparent_26%)]" />
            <div className="absolute inset-0 hidden opacity-[0.22] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:72px_72px] sm:block" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/68 to-background" />
        </div>
    );
}
