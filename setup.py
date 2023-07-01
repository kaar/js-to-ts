from setuptools import setup

DEPENDENCIES = ["requests"]

setup(
    name="js_to_ts",
    version="0.1",
    packages=["js_to_ts"],
    install_requires=DEPENDENCIES,
    entry_points={"console_scripts": ["js-to-ts=js_to_ts.main:main"]},
)
